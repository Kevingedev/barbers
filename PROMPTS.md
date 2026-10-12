# Prompts

Los prompts principales que usamos con OpenCode para montar la web de Barbería Áureo, en el orden en que se lanzaron. No están los ajustes pequeños (header, CLS, alineaciones…).

Todos los prompts de diseño y copy pasan por la skill [`landing-page-design`](.opencode/skills/landing-page-design/SKILL.md), que está traducida al stack de este proyecto: Next.js 15, CSS custom properties en `src/styles/globals.css` y GSAP. Las reglas del design system viven en [`AGENTS.md`](AGENTS.md).

## 0. Preparación

Copiar las variables de entorno y rellenar lo que falte:

```sh
cp .env.example .env.local
```

```text
Lee .env.example y dime qué variables necesito para que la web funcione en local, y para cuáles necesito pedirte el valor.
```

Instalar dependencias:

```text
Instala las dependencias que falten con pnpm.
```

## 1. Primera versión de la web (skill landing-page-design)

```text
Usa la skill landing-page-design. Vamos a crear la landing de Barbería Áureo, una peluquería y barbería real en Sevilla. Como es un negocio real, usa solo los datos de este mensaje, de su web y de las fotos: no inventes reseñas, premios, precios, años de experiencia ni cifras. Si falta algo, márcalo como pendiente.

Intake:
- Acción principal: reservar cita en /reservar. La secundaria es contacto por WhatsApp.
- Oferta: corte clásico 25 €, corte y barba 38 €, afeitado con navaja 22 €, ritual de barba 32 €, caballero sénior 28 €, arreglo de barba.
- Titular: "Barbería Áureo".
- Subtitular: el eslogan que ya está en src/messages/es.ts.
- Dirección: Calle de la Plata, 12, 41001 Sevilla.
- Horario: de lunes a sábado, domingo cerrado.
- Prueba: 14 años, 4.800 cortes, 3 barberos.
- Público (asumido): hombres de 25 a 55 en Sevilla capital que buscan un corte bien hecho sin gastar de más.
- Objeciones (asumidas): el precio, el miedo a que corte mal, y si atienden sin cita.
- Tráfico: Instagram y Google Maps.
- Tono: sobrio, cálido y premium.
- Fotos: aún no hay fotos reales del local. Pídemelas y no las generes con IA: serían un barbero que no existe.

Stack: proyecto Next.js 15 con App Router ya creado, con React 19, TypeScript estricto, GSAP, Mapbox y Zod. Sin Tailwind: los estilos van en src/styles/globals.css con custom properties.

Antes de escribir código, devuélveme lo que pide tu Output format.
```

## 2. Sistema de diseño como fuente única

```text
Quiero que todo el styling pase por las custom properties de src/styles/globals.css y por clases BEM. Ningún componente debe hardcodear colores ni medidas. Revisa lo que hay escrito y dime cuántos valores sueltos hay.
```

## 3. Flujo de reserva y WhatsApp

```text
El flujo de reserva depende de la bandera booking_enabled de site_settings. Cuando está activa, el CTA lleva a /reservar; cuando no, cambia a "Contactar por WhatsApp" y abre el chat con generateWhatsAppUrl. Comprueba que los dos caminos funcionan y que el número sale de configuración, nunca escrito a mano en un componente.
```

## 4. Reveals al hacer scroll

```text
Envuelve las secciones nuevas en el componente Reveal que ya hay en src/components/animations. No escribas animaciones nuevas ni uses window.addEventListener('scroll'): solo GSAP ScrollTrigger con autoAlpha y y, e importa GSAP de forma diferida para que no entre en el bundle inicial.
```

## 5. Fotos del local

```text
Voy a subir fotos reales del local a public/. Dime qué nombres y tamaños necesito para que se vean bien en el hero, en la sección de barberos y en la de visitanos, y cómo tenerlas optimizadas a webp.
```

## 6. SEO y datos estructurados

```text
Revisa los metadatos de src/app/layout.tsx y dime qué falta para position el sitio en búsquedas locales de peluquerías en Sevilla: title template, description, openGraph, favicon y schema.org de HairSalon con dirección, coordenadas y horario.
```

## 7. Revisión de conversión

```text
Aplica la Parte A de la skill landing-page-design al estado actual de la home. Dime qué objeciones no están respondidas, si falta la sección de reveal de tagline de B11, y si el CTA de /reservar compite con algún otro CTA sobre el pliegue.
```

## 8. Antes de dar por terminado

```text
Ejecuta pnpm lint, pnpm typecheck y pnpm build, y arregla lo que falle. Revisa después el contraste de #C5A880 sobre #0F0F11 para texto pequeño y la sección a 390px de ancho.
```

---

# Verificación

```sh
pnpm lint
pnpm typecheck
pnpm build
```

Las tres tienen que pasar antes de considerar terminado cualquier cambio.