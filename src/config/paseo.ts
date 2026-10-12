/**
 * Configuración del paseo: la única fuente de verdad del scroll world.
 *
 * Cada parada tiene un póster. El clip de una parada va de esa parada a la
 * siguiente, así que el número de clips es el de paradas que tengan clip. La
 * última parada puede no tenerlo: en ese caso el tramo final se queda en su
 * póster, con el clip anterior congelado en su último fotograma, que es
 * justamente la imagen a la que llega ese clip.
 *
 * Para cambiar el material basta con sustituir los ficheros de
 * `public/world/` (pósters) y `public/video/` (clips) y ajustar las rutas de
 * aquí. Para añadir o quitar paradas, edita el array `paradas`: el motor y el
 * raíl se adaptan solos, y el copy de las paradas nuevas sale de
 * `src/messages/`.
 *
 * Los pósters deben encajar con los clips:
 *
 * - El póster de la primera parada es el PRIMER fotograma del clip 1. Se ve
 *   mientras el clip carga, así que la entrada no se nota.
 * - El póster de una parada con clip es el último fotograma del clip que llega
 *   a ella, que es el primero de su propio clip. Si no encajan, se nota el
 *   salto en la costura.
 *
 * Se sacan del propio MP4 con:
 *
 * # primer fotograma (póster de salida)
 * ffmpeg -i public/video/paseo-1.mp4 -frames:v 1 \
 *   -vf "scale=in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24" frame.png
 *
 * # último fotograma (póster de llegada)
 * ffmpeg -sseof -0.1 -i public/video/paseo-1.mp4 -frames:v 1 \
 *   -vf "scale=in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24" frame.png
 *
 * y luego se convierten a webp. Son decorativos: van detrás del texto, así que
 * no llevan texto alternativo.
 */

export type Parada = {
  /** Ancla de la parada. Único en la página y usado por el raíl lateral. */
  id: string;
  /** Nombre corto de la parada, el que ve el visitante en el raíl. */
  lugar: string;
  /**
   * Clip que va de esta parada a la siguiente. Si falta, el tramo termina en el
   * póster: el clip anterior se congela en su último fotograma.
   */
  clip?: string;
  /**
   * Punto horizontal del vídeo (0 a 100) que queda a la vista en móvil, donde
   * el 16:9 se recorta. Mira el fotograma y mueve este valor hasta que el
   * sujeto quede centrado.
   */
  focus: number;
  /** Fotograma con el que se ve esta parada. Se ve mientras carga el clip. */
  poster: string;
};

/**
 * Material actual del paseo.
 *
 * `public/video/paseo-1.mp4`: 1280×720, 5,03 s, 60 fps, H.264, sin audio, 4,3 MB.
 *
 * LO IMPORTANTE ES EL GOP: un keyframe cada 2 fotogramas (`-g 2 -keyint_min 2
 * -sc_threshold 0`). Con un GOP más largo el scrub se arrastra, y no es cosa
 * del código: cada salto de `currentTime` obliga a decodificar desde el último
 * keyframe, así que un GOP de 6 obligaba a decodificar hasta 6 fotogramas en
 * cada salto. Medido en esta web, GOP 6 daba 146 frames por debajo de 30 fps
 * con picos de 12 segundos; GOP 2 da cero frames por debajo de 30 fps.
 *
 * Los 60 fps son el resultado de interpolar el original de 24 fps con
 * `minterpolate`, que es lo que hace que el movimiento no dé escalones.
 *
 * Si vuelves a subir un clip, pásalo por:
 *
 * ffmpeg -i original.mp4 -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir,scale=1280:720:flags=lanczos" \
 *   -an -c:v libx264 -preset veryslow -crf 31 \
 *   -g 2 -keyint_min 2 -sc_threshold 0 -pix_fmt yuv420p \
 *   -color_primaries bt709 -color_trc iec61966-2-1 -colorspace bt709 -color_range tv \
 *   -movflags +faststart+write_colr paseo-1.mp4
 *
 * Los pósters salen del resultado, no de las fotos originales: el primero y el
 * último fotograma del MP4, para que encajen con el vídeo.
 *
 * ffmpeg -i paseo-1.mp4 -frames:v 1 -vf "scale=in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24" first.png
 * ffmpeg -sseof -0.15 -i paseo-1.mp4 -frames:v 1 -vf "scale=in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24" last.png
 *
 * TODO: sustituir por material real del local.
 */
export const paseo: { paradas: Parada[] } = {
  paradas: [
    {
      id: "inicio",
      lugar: "La entrada",
      clip: "/video/paseo-1.mp4",
      focus: 50,
      poster: "/world/paseo-1.webp"
    },
    {
      id: "oficio",
      lugar: "La silla",
      focus: 50,
      poster: "/world/paseo-2.webp"
    }
  ]
};