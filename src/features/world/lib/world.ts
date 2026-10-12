import type { gsap } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type Key = { y: number; v: number };

/** Interpola un valor por tramos según la posición de scroll. */
const piecewise = (y: number, keys: Key[]) => {
  if (y <= keys[0].y) return keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (y <= b.y) return a.v + (b.v - a.v) * ((y - a.y) / (b.y - a.y || 1));
  }
  return keys[keys.length - 1].v;
};

/**
 * Paseo por la barbería: el scroll mueve los clips (o los pósters, mientras el
 * clip del tramo no ha cargado) y cada parada muestra su texto. Cada parada
 * tiene un clip que va de ella a la siguiente; el de la última sigue hasta el
 * final de la sección.
 *
 * `w` es la posición en el paseo: 0 en la primera parada, 1 en la segunda, 2,5 a
 * medio camino entre la tercera y la cuarta. Al acabar la sección vale
 * `stops.length`, para que el último clip también tenga su tramo.
 *
 * Devuelve la función de limpieza. Es obligatoria: en React el efecto se monta
 * y se desmonta, y los ScrollTrigger que se dejan vivos siguen escuchando.
 */
export function initWorld(
  world: HTMLElement,
  reduceMotion: boolean,
  gsapApi: typeof gsap,
  ScrollTrigger: typeof ScrollTriggerType
): () => void {
  const clamp = gsapApi.utils.clamp(0, 1);
  const stage = world.querySelector<HTMLElement>("[data-stage]");
  if (!stage) return () => {};

  /**
   * Alto de la ventana en px, medido UNA vez y publicado en `--world-vh`.
   *
   * El escenario y las paradas miden su alto en multiples de este valor en vez
   * de usar `dvh`/`svh`: con unidades de viewport el navegador recalcula la
   * altura en cada scroll (la barra de direcciones del móvil la cambia) y eso
   * obliga a rehacer el layout del documento entero mientras el motor escribe
   * estilos. Medir una vez y convertir a px quita ese relayout por frame.
   */
  const measure = () => {
    world.style.setProperty("--world-vh", String(window.innerHeight));
  };
  measure();

  // Rotar el móvil o mover una ventana cambia el alto: se vuelve a medir, pero
  // solo cuando cambia de verdad.
  let lastHeight = window.innerHeight;
  const onResize = () => {
    if (window.innerHeight === lastHeight) return;
    lastHeight = window.innerHeight;
    measure();
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);

  const stops = [...world.querySelectorAll<HTMLElement>("[data-stop]")];
  const frames = [...stage.querySelectorAll<HTMLElement>("[data-frame]")];
  const links = [...stage.querySelectorAll<HTMLAnchorElement>("[data-goto]")];
  const fill = stage.querySelector<HTMLElement>("[data-rail-fill]");
  const hint = stage.querySelector<HTMLElement>("[data-hint]");
  const clips = [...stage.querySelectorAll<HTMLVideoElement>("[data-clip]")];
  const last = stops.length - 1;
  const focus = stops.map((stop) => Number(stop.dataset.focus ?? 50));

  /**
   * Tramo del paseo al que pertenece cada clip. Una parada sin clip deja su
   * tramo sin vídeo, así que no se puede asumir que el clip N va al tramo N.
   */
  const segments = clips.map((clip) => Number(clip.dataset.segment));

  let disposed = false;

  // Cada parada llega cuando su artículo toca el borde superior; el paseo
  // termina al acabar la sección.
  const marks = stops.map((stop) => ScrollTrigger.create({ trigger: stop, start: "top top" }));
  const ready = clips.map(() => false);
  let current = -1;
  let w = 0;
  let active = -1;
  let shown = -1;

  // Últimos valores escritos, para no tocar el DOM si no han cambiado.
  let lastFocusX = "";
  let lastRailScale = "";
  let lastHintOpacity = "";
  const frameOpacity: number[] = [];
  const frameScale: number[] = [];
  const framePromoted: boolean[] = [];

  const setCurrent = (index: number) => {
    if (index === current) return;
    current = index;
    stops.forEach((stop, i) => stop.classList.toggle("is-current", i === index));
    links.forEach((link, i) => link.setAttribute("aria-current", String(i === index)));
  };

  // El clip del tramo entra en cuanto ha buscado su fotograma. Si aún no ha
  // cargado, los pósters vuelven a verse.
  const show = () => {
    if (shown !== active) {
      shown = active;
      clips.forEach((clip, i) => clip.classList.toggle("is-shown", i === active));
    }
    stage.dataset.mode = "video";
  };

  /** Pasa los clips a invisible y quita el modo vídeo: se ve el póster. */
  const hide = () => {
    delete stage.dataset.mode;
    if (shown !== -1) {
      shown = -1;
      clips.forEach((clip) => clip.classList.remove("is-shown"));
    }
  };

  /**
 * Lleva el clip a `target`.
 *
 * Un salto de `currentTime` obliga al navegador a decodificar desde el último
 * keyframe. Medido en este proyecto, un salto cuesta entre 60 y 130 ms, así que
 * el techo real son unos 16 saltos por segundo.
 *
 * Se probaron dos alternativas y ambas fueron PEORES que el salto directo:
 *
 * - Limitar los saltos a 30 por segundo con un intervalo: el vídeo se quedaba
 *   congelado hasta un segundo mientras el scroll seguía, y los picos llegaron
 *   a 1200 ms.
 * - Interpolar con un tween de GSAP: cada tween cancelaba el anterior y
 *   reiniciaba la decodificación (19 frames por debajo de 30 fps, picos de
 *   266 ms).
 *
 * El salto directo es lo más predecible: el vídeo avanza a saltos grandes, que
 * es lo que menos decodificación pide, y el scroll no se resiente porque este
 * motor apenas hace trabajo por frame.
 */
const seekTo = (clip: HTMLVideoElement, target: number) => {
    const end = Math.max(0, Math.min(target, clip.duration - 1 / 120));

    if (Math.abs(clip.currentTime - end) < 1 / 120) {
      show();
      return;
    }

    // El navegador sigue decodificando: se espera. Encolar otro salto solo
    // cancelaría el que ya está en marcha.
    if (clip.seeking) return;

    clip.currentTime = end;
  };

  /** Repinta el paseo. Se asigna cuando existe el trigger que alimenta `render`. */
  let refresh = () => {};

  const render = (self: ScrollTrigger) => {
    if (disposed) return;
    const y = self.scroll();
    w = piecewise(y, [
      ...marks.map((mark, i) => ({ y: mark.start, v: i })),
      { y: self.end, v: stops.length }
    ]);
    const at = Math.min(w, last);

    setCurrent(Math.round(at));

    // Escribir estos valores en cada frame invalida el layout de toda la sección
    // aunque no cambien, y con ello el `object-position` de las imágenes y del
    // vídeo. Solo se tocan cuando el valor es otro.
    const focusX = `${piecewise(
      y,
      marks.map((mark, i) => ({ y: mark.start, v: focus[i] }))
    )}%`;
    if (focusX !== lastFocusX) {
      lastFocusX = focusX;
      stage.style.setProperty("--focus-x", focusX);
    }

    const railScale = last > 0 ? `scaleY(${at / last})` : "scaleY(1)";
    if (railScale !== lastRailScale) {
      lastRailScale = railScale;
      if (fill) fill.style.transform = railScale;
    }

    const hintOpacity = String(clamp(1 - w * 4));
    if (hintOpacity !== lastHintOpacity) {
      lastHintOpacity = hintOpacity;
      if (hint) hint.style.opacity = hintOpacity;
    }

    // Pósters (debajo de los clips): cada uno está entero y sin escalar justo en
    // su parada, donde empieza su clip, así el vídeo entra encima sin que se
    // note. Aparece en la segunda mitad del tramo anterior y se acerca al avanzar.
    // El compositor necesita saber de antemano que el elemento se va a mover:
    // con dos posters a pantalla completa, `will-change` se activa solo al
    // empezar su tramo y se quita al salir, en vez de quedar fijo para siempre.
    frames.forEach((frame, i) => {
      const opacity = i === 0 ? 1 : clamp((w - i + 0.5) / 0.5);
      const isVisible = opacity > 0.001;

      if (isVisible !== framePromoted[i]) {
        framePromoted[i] = isVisible;
        frame.style.willChange = isVisible ? "opacity, transform" : "auto";
      }

      if (opacity !== frameOpacity[i]) {
        frameOpacity[i] = opacity;
        frame.style.opacity = String(opacity);
      }
      if (!reduceMotion) {
        const scale = 1 + 0.06 * clamp(w - i);
        if (scale !== frameScale[i]) {
          frameScale[i] = scale;
          frame.style.transform = `scale(${scale})`;
        }
      }
    });

    if (!clips.length) return;

    // El tramo actual es el entero de `w`: el clip que lo cubre avanza con la
    // parte decimal. Si el tramo no tiene clip, el anterior se congela en su
    // último fotograma, que es la imagen a la que llegó ese clip.
    const segment = Math.floor(w);
    const next = segments.indexOf(segment);

    if (next >= 0) {
      active = next;
      const { duration } = clips[active];
      if (ready[active]) {
        seekTo(clips[active], Math.min((w - segment) * duration, duration - 0.05));
      } else hide();
      return;
    }

    const { duration } = clips[active] ?? { duration: 0 };
    if (active >= 0 && duration) seekTo(clips[active], duration - 0.05);
    else hide();
  };

  const span = ScrollTrigger.create({
    trigger: world,
    start: "top top",
    end: "bottom bottom",
    onUpdate: render,
    onRefresh: render
  });
  render(span);
  refresh = () => render(span);

  /** Marca la sección como animada: a partir de aquí el texto se oculta hasta
   *  que su parada es la actual. Si el motor no llega, el texto se queda visible. */
  world.classList.add("is-world");

  const teardown = () => {
    disposed = true;
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    span.kill();
    marks.forEach((mark) => mark.kill());
  };

  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData;

  // Sin clips, con movimiento reducido o con ahorro de datos se quedan los pósters.
  if (!clips.length || reduceMotion || saveData) return teardown;

  // Los clips se cargan de uno en uno: primero el del tramo actual y después el
  // más cercano a la posición del scroll. A igual distancia va antes el que
  // viene por delante.
  const distance = (i: number) => {
    if (i === active) return -1;
    if (i > w) return i - w;
    return w - (i + 1) + 0.5;
  };
  const queue = clips.map((_, i) => i);

  const loadNext = async () => {
    if (disposed) return;
    queue.sort((a, b) => distance(a) - distance(b));
    const i = queue.shift();
    if (i === undefined) return;
    const clip = clips[i];
    const src = clip.dataset.src ?? "";
    clip.preload = "auto";

    // Cada clip se descarga entero (blob) para que el scrub no dependa de la red.
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(res.statusText);
      clip.src = URL.createObjectURL(await res.blob());
    } catch {
      clip.src = src;
    }

    if (disposed) return;

    const loaded = await new Promise<boolean>((resolve) => {
      clip.addEventListener("loadeddata", () => resolve(true), { once: true });
      clip.addEventListener("error", () => resolve(false), { once: true });
    });

    if (!disposed && loaded) {
      // iOS no pinta los fotogramas buscados hasta que el vídeo se ha reproducido
      // una vez.
      await clip.play().catch(() => {});
      clip.pause();
      ready[i] = true;
      refresh();
    }
    if (!disposed) loadNext();
  };

  if (document.readyState === "complete") void loadNext();
  else window.addEventListener("load", () => void loadNext(), { once: true });

  // El refresco global de triggers vive en `SmoothScroll`, que lo hace al
  // cargar la página y cuando están las fuentes. Aquí no se repite para no
  // recalcular dos veces lo mismo.
  return teardown;
}