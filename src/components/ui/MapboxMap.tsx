"use client";

import { useEffect, useRef } from "react";

import { env } from "@/config/env";
import { SITE_NAME, VENUE } from "@/config/site";

export type MapboxMapProps = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

export function MapboxMap({ latitude, longitude, zoom = 14 }: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;

    /**
     * El mapa está casi al final de la página. Montarlo nada más entrar descarga
     * megabytes de teselas que el visitante no va a ver en los primeros
     * segundos, y en móvil eso se paga con datos. Con este margen solo se
     * construye cuando ya está a punto de aparecer en pantalla.
     */
    async function loadMap() {
      // El await corta el estrechamiento de tipo que hizo el `if (!container)`
      // de fuera, así que se comprueba otra vez aquí.
      const target = container;
      if (!target) return;

      const mapboxgl = (await import("mapbox-gl")).default;

      mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: target,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [longitude, latitude],
        zoom,
        // Con attributionControl en su sitio, los + y − irían abajo a la derecha
        // y taparían el marcador; el control se añade justo debajo.
        attributionControl: false,
        // El mapa se puede arrastrar y ampliar. Antes llevaba `interactive: false`
        // para que no pidiera teselas de las zonas vecinas al pasar el cursor,
        // pero eso también quitaba los manejadores de puntero y el mapa quedaba
        // muerto. El ahorro se consigue en otro sitio: con el IntersectionObserver
        // de abajo el mapa no se construye hasta que está cerca de la vista, y
        // con `cooperativeGestures` la rueda sigue desplazando la página salvo
        // que el visitante esté sobre el mapa.
        cooperativeGestures: true
      });

      map.addControl(new mapboxgl.AttributionControl({ compact: true }));
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-left");

      map.on("load", () => {
        // Marcador propio: un punto y, al lado, el nombre de la peluquería. El
        // marker por defecto de Mapbox no lleva texto.
        const pin = document.createElement("div");
        pin.className = "venue-pin";
        pin.innerHTML = `
          <span class="venue-pin__dot" aria-hidden="true"></span>
          <span class="venue-pin__label">${SITE_NAME}</span>
        `;

        new mapboxgl.Marker({ element: pin, anchor: "left" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 24, closeButton: false }).setHTML(
              `<p class="mapbox-popup__name">${SITE_NAME}</p><p class="mapbox-popup__address">${VENUE.addressLine}</p>`
            )
          )
          .addTo(map);

        map.easeTo({ center: [longitude, latitude], zoom, duration: 0 });
      });

      cleanup = () => {
        map.remove();
      };
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer?.disconnect();
          observer = undefined;
          void loadMap();
        }
      },
      // 400px antes de que llegue: hay margen de sobra para que llegue cargada.
      { rootMargin: "400px" }
    );
    observer.observe(container);

    return () => {
      observer?.disconnect();
      cleanup?.();
    };
  }, [latitude, longitude, zoom]);

  return <div className="mapbox-map" ref={mapContainerRef} />;
}