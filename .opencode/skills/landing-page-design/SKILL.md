---
name: landing-page-design
description: "Sistema completo para construir landing pages que convierten: intake, estructura de página, elección de layout, copy de conversión, SEO/AEO, más reglas visuales estrictas de tipografía, espaciado, radios, fondos, hero, iconos y movimiento. Úsala siempre que edites, maquetes, revises o escribas copy de CUALQUIER landing, sección, componente o página de este proyecto (Barbería Áureo), aunque el usuario no mencione diseño, conversión, tokens ni design system. Consúltala antes de elegir secciones, titulares, CTAs, fuentes, tamaños, espaciados, radios, colores, iconos o transiciones. Adaptada al stack Next.js 15 + CSS custom properties + GSAP de barber-web."
---

# Landing Page Design (Barbería Áureo)

Una landing no es una homepage. Una homepage sirve varios intents. Una landing gana un intent:

**una oferta → una audiencia → una acción principal.**

Esta skill tiene dos mitades. **Parte A** decide qué dice la página y cómo se estructura. **Parte B** es el sistema visual innegociable. Haz A antes de tocar B.

## Scope

Aplica a todo el trabajo de UI web del proyecto: secciones de `src/app/page.tsx`, la home, `/reservar`, componentes de `src/components`, features de `src/features` y revisiones de diseño. Cuando una regla de aquí choque con un default de Next.js o de CSS, gana este archivo. Cuando el prompt explícito del usuario choque con una regla, gana el usuario.

**Adaptación al proyecto.** Este proyecto **no usa Tailwind**. Los valores viven como custom properties en `src/styles/globals.css` y como clases CSS con nomenclatura BEM (`block__element--modifier`). Este archivo es la versión traducida de las reglas originales a ese stack: donde la fuente decía "clase de Tailwind", aquí se dice "custom property o clase del design system". No introduzcas clases de Tailwind ni framework de estilos nuevo.

---

# PARTE A — Estrategia y estructura

## A1. Intake

Reúne esto antes de diseñar o escribir. Pregunta solo lo que falte, y hazlo **en un lote**, no pregunta a pregunta.

**Propósito**
- ¿Cuál es la ÚNICA acción principal? (reservar cita, pedir presupuesto, contactar)
- ¿Cuál es la oferta exactamente, qué reciben?
- ¿Qué cuenta como conversión? (clic, reserva completada, mensaje a WhatsApp)

**Audiencia y contexto**
- ¿Quién es el ICP?
- ¿Qué problema intentan resolver?
- Tres objeciones principales: por qué no convierten hoy
- Origen del tráfico: anuncios, búsqueda, redes, email
- ¿Qué saben ya los visitantes al llegar?

**Prueba y assets**
- Proof points: logos, testimonios, cifras, casos
- Fotos del local, del equipo, del trabajo
- Garantías, política de cancelación, consultas de cancelaciones

**Restricciones**
- Tono de marca: casual o profesional
- Dirección de diseño: se usa el design system existente, no uno nuevo
- ¿Prioridad móvil?

Si el usuario no puede responder, haz una suposición razonable, dila en una línea y sigue. No bloquees la construcción.

**Regla barbería.** Áureo es un negocio real. No inventes reseñas, premios, precios, anni de experiencia ni cifras. Usa solo lo que esté verificado en `src/features/*/data/` y `src/messages/`. Si falta algo, márcalo como pendiente en vez de rellenarlo.

## A2. Estructura de página

**Sobre el pliegue (obligatorio)**
1. Titular, resultado más audiencia
2. Subtítulo, aclara el cómo y añade especificidad
3. CTA principal, verbo claro más lo que reciben
4. Una señal de prueba: franja de logos, cifra o testimonio corto
5. Visual de hero: foto del local, del Barbero o vídeo corto

**Medio de página (el argumento)**
6. De problema a solución, una sección
7. Beneficios, de tres a cinco, orientados a resultado
8. Cómo funciona, tres pasos
9. Prueba social: testimonios o un caso

**Final (manejo de objeciones)**
10. FAQ, de seis a doce preguntas
11. Reducción de riesgo: garantía, cancelación flexible, sin pago adelantado
12. CTA final, idéntico al de arriba

Incluye la sección obligatoria de reveal de tagline de B11 en el argumento de medio de página, normalmente justo después del hero o después de beneficios.

## A3. Elección de layout

Elige uno y explica por qué.

| Tipo | Cuándo |
|---|---|
| **A. Hero clásico más secciones** | El producto se entiende con una foto del hero. Lo más común. |
| **B. Historia larga** | Hay que educar y vencer el escepticismo. |
| **C. Mínima de conversión** | Tráfico de alta intención, o una oferta corta. |
| **D. Comparativa** | La intención de búsqueda incluye alternativas. Suele ir con páginas SEO. |

## A4. Reglas de conversión

**Casilla el mensaje con el origen.** Si el tráfico viene de Instagram o Google Maps, el hero debe hablar el mismo idioma que el anuncio o la ficha.

**Haz obvio el siguiente paso.** Un CTA principal. Nunca CTAs competidores sobre el pliegue.

**Beneficio primero.** Features son lo que hace. Beneficios son lo que eso significa para ellos.

**Sé específico.**
- ❌ "Ahorra tiempo y optimiza tu rutina"
- ✅ "Corte y barba en 45 minutos, sin cita_waitlist de tres semanas"

**Reduce riesgo.** Elige al menos uno: consulta inicial gratuita, cancelación flexible, no se paga nada al reservar, recordatorio por WhatsApp.

**Trata las objeciones como sección, no como nota al pie.** Sube el FAQ antes cuando la fricción es alta. Pon la prueba junto a la afirmación que sostiene.

## A5. Copywriting

**Fórmulas de titular**
- "{Resultado} sin {dolor}"
- "El {categoría} para {audiencia}"
- "{Resultado} en {tiempo}"

**Subtítulo.** Una o dos frases. Aclara qué es y para quién es.

**CTA.** Verbo más lo que reciben. Nunca "Saber más" ni "Enviar". Usa "Reservar cita", "Pedir presupuesto", "Ver la carta".

**Bullets de beneficio.** Beneficio en negrita, luego la prueba o el detalle. Ejemplo: **Corte con navaja** — toalla caliente y perfilado a navaja, 25 minutos.

Las reglas de copy de B1 siguen vigentes. Sin guiones dentro de frases, sin palabras huérfanas.

## A6. Orden de construcción

Trabaja sección por sección, en este orden:

1. Hero
2. Beneficios
3. Cómo funciona
4. Prueba
5. FAQ
6. CTA final

Nunca rehagas la página entera en cada iteración. Sección por sección mantiene el control y mantiene los diffs revisables.

## A7. SEO y AEO

**No indexes** páginas solo de campaña o ofertas muy atadas al tiempo. Usa `noindex` o una ruta sin indexar.

**Indexes** ofertas evergreen y páginas donde la intención de búsqueda coincide con la promesa. Título y meta description claros, enlaces internos desde la home, y el FAQ en forma literal de pregunta y respuesta para AEO. Añade schema de FAQ si tiene sentido.

En este proyecto los metas viven en `src/app/layout.tsx` con el objeto `metadata` de Next.js, y las plantillas por página se resuelven con `title.template`. No inventes etiquetas `<head>` a mano.

## A8. Trampas

- Demasiados CTAs sobre el pliegue
- Propuesta de valor vaga: "optimizamos", "potenciamos"
- Una lista larga de features sin resultados
- La prueba enterrada al final
- Layout móvil que rompe la legibilidad
- Ningún siguiente paso claro

---

# PARTE B — Sistema visual

Cada valor visual debe resolverse con estas reglas en lugar de inventarse sobre la marcha.

## B0. Tokens del proyecto

Los valores autoritativos viven en `src/styles/globals.css`. **No hardcodees colores ni medidas en componentes**: consume las custom properties.

```plaintext
Fondo base      #0F0F11   --color-background
Acento          #C5A880   --color-accent
Texto           #EDEDED   --color-foreground
Apagado         68%       --color-muted
Borde           24% acento --color-border
Superficie      6% texto  --color-surface
Error           #D16A5F   --color-error
Radio           8px       --radius
Ritmo vertical  clamp(4.5rem, 10vw, 8rem) --space-section
```

Las superficies derivadas que ya existen y son válidas: `#0a0a0c` para el pie, `#16161a` para inputs, `#d3b995` como hover del acento, `#d9b38c` como aviso de éxito.

## B1. Tipografía

### Fuentes

**Display:** Cormorant Garamond, cargada con `next/font/google` en `src/app/layout.tsx` y expuesta como `--font-display`.
**Cuerpo y UI:** Plus Jakarta Sans, igual, como `--font-body`.

**Nunca** introduzcas una tercera tipografía. Ni Inter, ni Roboto, ni Arial, ni Helvetica, ni una display occidental.

**Nunca uses tipografías en itálica** en la interfaz. Si el contenido pide emphasis, usa peso o color.

**Nunca uses pesos ultra bold** (900 / black). Tope en 600 o 700, que es lo que ya carga `next/font`.

**Una familia por vez.** El pairing display más cuerpo es la excepción explícita del design system de Áureo y ya está resuelto en `layout.tsx`. No añadas una tercera.

### Reglas de copy

**Sin guiones en el texto.** No uses `-` dentro del body copy, los titulares o las etiquetas. Reescribe la frase.

**Sin palabras huérfanas.** Una sola palabra nunca debe quedar sola en la última línea. Aplica `text-wrap: balance` en titulares y `text-wrap: pretty` en body copy.

### Escala tipográfica

Este proyecto no usa la escala de Tailwind. Resuelve los tamaños a la escala de abajo, expresada en custom properties. Si un tamaño existente no cae justo en un paso, ajústalo al **paso más cercano por debajo**, tomando tamaño y line height del par.

| Token | Tamaño | Line height |
|---|---|---|
| `--text-xs` | 12px (0.75rem) | 16px |
| `--text-sm` | 14px (0.875rem) | 20px |
| `--text-base` | 16px (1rem) | 24px |
| `--text-lg` | 18px (1.125rem) | 28px |
| `--text-xl` | 20px (1.25rem) | 28px |
| `--text-2xl` | 24px (1.5rem) | 32px |
| `--text-3xl` | 30px (1.875rem) | 36px |
| `--text-4xl` | 36px (2.25rem) | 40px |
| `--text-5xl` | 48px (3rem) | 1 |
| `--text-6xl` | 60px (3.75rem) | 1 |
| `--text-7xl` | 72px (4.5rem) | 1 |
| `--text-8xl` | 96px (6rem) | 1 |

**Excepción del hero.** Los títulos display del hero y de los section headings ya usan `clamp()` con valores fluidos, que es lo correcto para una landing. Mantén ese patrón: `clamp(min, preferred_vw, max)`. No introduzcas tamaños arbitrarios fijos donde ya hay un `clamp()`.

No combines el ajuste de escala con line heights independientes en una misma auditoría. Tracking y line height solo se ajustan **dentro** del valor que ya da el paso elegido.

### Tamaño en botones

- Botones principales: `--text-base` (16px), peso 600 o 700.
- Botones pequeños de cabecera: `--text-sm` (14px), peso 700.

## B2. Espaciado

Solo estos valores. Nada entre ellos, nada fuera.

| Token | Valor |
|---|---|
| Spacing-0 | 0 |
| Spacing-25 | 2px |
| Spacing-50 | 4px |
| Spacing-75 | 8px |
| Spacing-100 | 12px |
| Spacing-200 | 16px |
| Spacing-300 | 24px |
| Spacing-400 | 32px |
| Spacing-500 | 40px |
| Spacing-600 | 48px |
| Spacing-700 | 64px |
| Spacing-800 | 80px |
| Spacing-900 | 96px |

**Botones principales:** 48px de alto mínimo, 24px de padding horizontal. Es lo que ya hace `.primary-button`.

**Ritmo de sección:** usa `--space-section`. No inventes un padding vertical nuevo por sección.

## B3. Radio

Solo valores del design system: `--radius` (8px), 6px para controles pequeños, `999px` para píldoras, `50%` para avatares y monogramas.

**Fórmula de radio anidado.** Cuando una forma va dentro de otra y el hueco entre ellas es **menor de 32px**:

```
radio interno = radio externo − hueco
```

Aplícalo solo cuando el resultado sea **mayor que 2px**. Por debajo de eso, deja la forma interna cuadrada o sin cambios.

Ejemplo: una tarjeta con `--radius` (8px) y 16px de padding interno no produce radio anidado, porque 8 − 16 es negativo. En ese caso los hijos van cuadrados o con `999px` si son píldoras.

## B4. Bordes y fondos

- **Nunca apliques borde solo a un lado de una tarjeta.** Los bordes van todos alrededor o ninguno.
- **Nunca uses degradados en fondos de tarjeta.** Los fondos son planos. Las dos excepciones que ya existen y son intencionadas: el velo del navbar y el lavado de `.section--contact`. No añadas más.

### Fondos del tema oscuro

Usa solo los del proyecto: `#0F0F11` como base, `#0a0a0c` para el pie, `#16161a` para inputs, más las superficies en alfa de `--color-surface` y `--color-border`.

## B5. Sección hero

### Color del titular

- **Tema oscuro:** color plano `--color-foreground` (`#EDEDED`), con el acento `--color-accent` reservado para el eyebrow y el tagline.

Este proyecto no usa degradado en el texto del titular. La jerarquía se construye con el acento en `.eyebrow` y `.hero-tagline`, y con tamaño y peso del display. No introduzcas el degradado `#FFFFFF → #9B9B9B` de la skill original: el design system de Áureo es de tres colores sobrios y sin degradados.

### Layout

- El titular y el subtítulo llevan un **ancho máximo de 680px**. `.hero-content` ya está en 780px y `.hero-copy` en 62ch, así que ajusta a 680px en el titular.
- Lee el copy del titular e inserta saltos de línea en puntos **significativos**.
- Nunca rompas una línea de forma que corte una frase o vuelva la misma más difícil de leer. Rompe donde se rompe el pensamiento.

## B6. Iconos

**Usa:** Phosphor, Solar o Iconamoon.
**Nunca uses:** Material Icons ni Material Symbols.

Si el proyecto necesita iconos, prefiere SVG en línea dentro de un componente de `src/components/ui/`, con `currentColor` y `aria-hidden="true"` cuando el icono es decorativo.

## B7. Coreografía de movimiento (fluido)

Nunca uses transiciones por defecto. Todo el movimiento simula masa real y física de resorte mediante cubic béziers propios.

```css
transition: transform 700ms cubic-bezier(0.32, 0.72, 0, 1);
```

En GSAP el equivalente es `power3.out` o `expo.out`, que es lo que ya usa `src/components/animations/Reveal.tsx`.

### Barra de navegación

**Estado abierto.** La `.navbar` es fija, con velo en degradado para legibilidad y `pointer-events: none` en el contenedor para que el scroll pase, reactivados en los hijos.

**Cierre en móvil.** Por debajo de 820px los links se ocultan. **Debe existir una alternativa**: un botón de menú o un CTA de reserva siempre visible. Nunca dejes al usuario de móvil sin forma de navegar ni de reservar.

**Morph de hamburguesa.** Al hacer clic, las líneas rotan y se trasladan hasta formar una X perfecta con `rotate-45` y `-rotate-45` en posicionamiento absoluto. Nunca desaparecen sin más.

**Expansión modal.** Si el menú se abre, es una overlay a pantalla completa con efecto glass pesado: `backdrop-blur` y `rgb(0 0 0 / 80%)`.

**Revelado escalonado con máscara.** Los links dentro del estado expandido aparecen con fade y slide desde una caja invisible, `translate-y-12 opacity-0` resolviendo a `translate-y-0 opacity-100`, escalonado por ítem con retardos de 100, 150, 200 ms y así.

### Interpolación de scroll

Los elementos nunca aparecen estáticos al cargar. Al entrar en viewport ejecutan un fade up suave y pesado:

```
translate-y-16 blur-md opacity-0  →  translate-y-0 blur-0 opacity-100
```

en 800ms o más.

**Usa el componente existente.** `src/components/animations/Reveal.tsx` ya envuelve a los hijos con GSAP ScrollTrigger, importa GSAP de forma diferida y solo anima `autoAlpha` y `y`. Envuelve las secciones nuevas en `<Reveal>` en lugar de escribir animaciones nuevas.

**Nunca uses `window.addEventListener('scroll')`** — provoca reflows continuos y mata el rendimiento en móvil. Si necesitas posición de scroll, usa `requestAnimationFrame` con throttling o `IntersectionObserver`.

## B8. Realismo del contenido

Nunca publiques relleno. Estas son las señales de que una página fue generada y no hecha.

- **Sin Lorem Ipsum.** Escribe copy real.
- **Sin "John Doe".** Usa nombres diversos y realistas.
- **Sin marcas placeholder** tipo "Acme Corp" o "SmartFlow". Áureo es un negocio real: usa el nombre real.
- **Sin números redondos y falsos** como `99.99%` o `$100.00`. Usa datos orgánicos: `47.2%`, `37.3886`, `+34 600 00 00 00`.
- **Sin clichés de IA.** Nunca "Elevate", "Seamless", "Unleash", "Next Gen", "game changer", "Delve", "Tapestry", ni "In the world of".
- **Titulares en sentence case**, no Title Case en todo.
- **Voz activa.** "No pudimos guardar tus cambios", no "Se cometeron errores".
- **Sin signos de exclamación** en mensajes de éxito, y sin "¡Vaya!" en errores. Sé directo: "No se pudo conectar. Inténtalo de nuevo."
- **Avatares únicos** por persona y fechas de blog variadas.

## B9. Estados

Todo elemento interactivo se entrega con su juego completo de estados:

- **Hover** — cambio de fondo, escala ligera o translate
- **Active** — `scale(0.98)` o `translateY(1px)` para realimentación física
- **Focus** — anillo de foco visible. Requisito de accesibilidad, no opcional. El proyecto ya lo tiene en `:focus-visible`
- **Loading** — esqueletos con la forma del layout real, no spinners circulares
- **Empty** — una vista compuesta de "empieza por aquí", nunca un panel vacío
- **Error** — inline y específico. Nunca `window.alert()`

Sin enlaces muertos. Un botón que apunta a `#` está enlazado o deshabilitado visualmente. La página actual debe estar indicada en la navegación.

## B10. Requisitos de entrega

Las cosas que se olvidan y hacen que una página parezca inacabada:

- Enlaces a privacidad y términos en el pie
- Un 404 con marca, ya existe en `src/app/not-found.tsx`
- Validación de formulario en cliente para formato de email y campos obligatorios, con Zod en `src/lib/validations/`
- Enlace de salto al contenido para teclado
- Consentimiento de cookies donde la jurisdicción lo exija
- Favicon con la marca
- `title`, meta description, `og:image` y etiquetas de compartir, ya en `src/app/layout.tsx`
- `alt` en toda imagen con significado
- HTML semántico: `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`
- Forma de volver desde cada página

## B11. Sección de reveal de tagline (obligatoria)

Toda landing incluye una sección grande de tipografía que enuncia el beneficio nuclear o el tagline, separada del hero. Va más abajo en la página como su propio momento, no apilada justo debajo del hero.

**Copy**
- Mínimo dos líneas de texto.
- Una declaración de beneficio o tagline, escrita en el tono de A5, no un encabezado de sección genérico.

**Tipografía**
- Tamaño `--text-4xl` a `--text-6xl` según el número de líneas.
- Ancho máximo acotado como el hero, para que las líneas rompan en puntos significativos.

**Animación**
- El texto empieza en un tono apagado, entre 25% y 35% de opacidad del color base del tema.
- Al entrar en viewport, cada palabra pasa individualmente de ese tono apagado al color de texto completo, en orden de lectura.
- Las palabras se activan de una en una al cruzar una línea disparadora, no todo el bloque de golpe. La transición usa la curva de B7, nunca un fade lineal.
- Implementa con `IntersectionObserver` por palabra, o un único listener de scroll pasado por `requestAnimationFrame`. Nunca un `window.addEventListener('scroll')` sin throttling.

---

# Output format

Cuando generes una landing desde cero, devuelve esto en orden antes de escribir código:

1. **Esquema de la página** — secciones y su orden
2. **Copy del hero** — titular, subtítulo, CTA, línea de prueba
3. **Beneficios** — de tres a cinco bullets orientados a resultado
4. **Cómo funciona** — tres pasos
5. **FAQ** — de seis a doce preguntas y respuestas
6. **SEO / AEO** — recomendación de indexar o no, más title y meta si se indexa
7. **Recomendación de layout** — A, B, C o D, y por qué

Luego construye sección por sección según A6.

---

# Quick checklist

**Estrategia**
- [ ] Una oferta, una audiencia, una acción principal
- [ ] Sin CTAs competidores sobre el pliegue
- [ ] Números específicos en vez de verbos vagos
- [ ] Al menos una reducción de riesgo
- [ ] La prueba junto a la afirmación que sostiene
- [ ] Tipo de layout elegido a propósito

**Visual**
- [ ] Solo Cormorant Garamond y Plus Jakarta Sans, sin itálicas, sin ultra bold
- [ ] Sin guiones en el copy, sin palabras huérfanas
- [ ] Cada tamaño cae en un paso de la escala
- [ ] Cada espaciado sale de la tabla
- [ ] Radios anidados con la fórmula
- [ ] Sin bordes de un solo lado, sin degradados en fondos
- [ ] Titular y subtítulo del hero acotados a 680px con cortes significativos
- [ ] Iconos de Phosphor, Solar o Iconamoon
- [ ] Toda transición con cubic bézier propio, revelados con IntersectionObserver o ScrollTrigger
- [ ] Sección de reveal de tagline presente, mínimo dos líneas, palabras de una en una

**Contenido y entrega**
- [ ] Sin Lorem Ipsum, sin marcas placeholder, sin clichés de IA, sin números falsos
- [ ] Estados hover, active, focus, loading, empty y error presentes
- [ ] Sin enlaces muertos, ítem de nav actual indicado
- [ ] 404, enlaces legales, validación de formulario, favicon, metas, alt

---

# Verificación antes de dar por terminado

```sh
pnpm lint
pnpm typecheck
pnpm build
```

Las tres tienen que pasar. Si has tocado estilos, revisa además el contraste de `--color-accent` sobre `--color-background` para texto pequeño y grande, y comprueba la sección a 390px de ancho.