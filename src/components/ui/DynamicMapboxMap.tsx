"use client";

import dynamic from "next/dynamic";

import { DIRECTIONS_URL, VENUE } from "@/config/site";
import { env } from "@/config/env";

import type { MapboxMapProps } from "@/components/ui/MapboxMap";

/**
 * Lo que ocupa el hueco del mapa mientras carga, y también para siempre si no
 * hay token de Mapbox. Un rectángulo vacío en medio de la página parece un
 * fallo; esto dice dónde está el local y lleva al mapa, que es lo que el
 * visitante viene a buscar.
 *
 * Nota: la comprobación del token se hace en el render del padre y no dentro de
 * `MapboxMap`. Las variables `NEXT_PUBLIC_*` se sustituyen por su valor al
 * compilar, así que servidor y cliente pueden ver valores distintos y, al
 * hidratar, React se quita el marcador de posición si el resultado no coincide.
 * Aquí se decide en un solo sitio y el resultado es el mismo para ambos.
 */
export function MapFallback() {
  return (
    <div className="mapbox-map mapbox-map--loading">
      <p className="mapbox-map__placeholder">
        {VENUE.addressLine}
        <br />
        {VENUE.cityLine}
      </p>
      <a className="mapbox-map__link" href={DIRECTIONS_URL} rel="noreferrer" target="_blank">
        Ver en el mapa
      </a>
    </div>
  );
}

const LazyMapboxMap = dynamic(
  () => import("@/components/ui/MapboxMap").then((mod) => mod.MapboxMap),
  { ssr: false, loading: () => <MapFallback /> }
);

type DynamicMapboxMapProps = Partial<MapboxMapProps>;

/**
 * Mapbox se carga de forma diferida (ssr: false) para no bloquear el FCP, y
 * además `MapboxMap` solo lo construye cuando se acerca a la vista. Sin token no
 * se descarga nada y se queda el marcador de posición con la dirección.
 */
export function DynamicMapboxMap({ latitude, longitude, zoom }: DynamicMapboxMapProps) {
  if (!env.NEXT_PUBLIC_MAPBOX_TOKEN) return <MapFallback />;

  return (
    <LazyMapboxMap
      latitude={latitude ?? VENUE.coordinates.latitude}
      longitude={longitude ?? VENUE.coordinates.longitude}
      zoom={zoom ?? 14}
    />
  );
}