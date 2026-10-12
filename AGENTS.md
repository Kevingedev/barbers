# Estándares de Desarrollo y Organización del Proyecto

Con el objetivo de garantizar mantenibilidad, escalabilidad y consistencia a largo plazo, todo el desarrollo seguirá un conjunto de estándares unificados de arquitectura, nomenclatura y organización.

## Arquitectura del Proyecto

La aplicación estará organizada mediante una estructura modular basada en dominios funcionales (*Feature-Based Architecture*), separando claramente las responsabilidades de cada área del sistema.

### Estructura principal

```plaintext
src/
├── app/
├── components/
├── features/
├── lib/
├── hooks/
├── types/
├── messages/
├── styles/
└── config/
```

Cada módulo contendrá únicamente la lógica relacionada con su funcionalidad específica, evitando dependencias innecesarias y facilitando el mantenimiento futuro.

---

## Convenciones de Nomenclatura

### Componentes React

Todos los componentes utilizarán nomenclatura PascalCase.

Ejemplos:

```plaintext
HeroSection.tsx
BookingCalendar.tsx
ServiceCard.tsx
Navbar.tsx
```

### Hooks

Todos los hooks personalizados utilizarán el prefijo `use`.

Ejemplos:

```plaintext
useBooking.ts
useScrollAnimation.ts
useLocale.ts
```

### Utilidades

Las funciones auxiliares utilizarán camelCase.

Ejemplos:

```plaintext
formatPrice.ts
generateWhatsAppUrl.ts
validateAppointment.ts
```

### Variables y Constantes Globales

Las constantes compartidas utilizarán formato UPPER_SNAKE_CASE.

Ejemplos:

```plaintext
MAX_BOOKING_DAYS
DEFAULT_LANGUAGE
WHATSAPP_PHONE
```

---

## Gestión de Variables de Entorno

Todas las configuraciones sensibles deberán almacenarse en variables de entorno.

Ejemplos:

```plaintext
NEXT_PUBLIC_MAPBOX_TOKEN
SUPABASE_URL
SUPABASE_ANON_KEY
WHATSAPP_PHONE_NUMBER
```

No se permitirá exponer credenciales o configuraciones sensibles directamente en el código fuente.

---

## Sistema de Tipado

Todo el proyecto utilizará TypeScript estricto.

### Reglas

* Evitar el uso de `any`.
* Definir tipos compartidos centralizados.
* Utilizar interfaces o tipos específicos para cada entidad de negocio.
* Mantener consistencia entre frontend y backend.

Ejemplos:

```typescript
type Appointment
type Service
type Barber
type Schedule
```

---

## Validaciones

Toda la validación de datos se realizará mediante Zod.

Las reglas de validación se centralizarán en:

```plaintext
src/lib/validations/
```

De esta forma se reutilizarán tanto en cliente como en servidor.

---

## Reservas e Integración con WhatsApp

El flujo de reservas deberá estar controlado por la configuración global del sitio.

### Configuración

La tabla `site_settings` mantendrá la bandera booleana:

```plaintext
booking_enabled
```

Esta bandera definirá si la web muestra el flujo guiado de reserva o deriva directamente al usuario a WhatsApp.

### Comportamiento

* Si `booking_enabled` está habilitado, el botón principal de reserva abrirá el flujo guiado completo:

```plaintext
Selección de barbero -> Servicio -> Fecha y hora -> Confirmación -> Notificación a WhatsApp/SMS
```

* Si `booking_enabled` está deshabilitado, el botón principal cambiará dinámicamente su texto a `Contactar por WhatsApp`.
* En modo WhatsApp directo, el botón abrirá el chat sin mostrar pasos intermedios innecesarios.
* La URL de WhatsApp deberá construirse con el formato:

```plaintext
https://wa.me/<NUMERO>?text=<MENSAJE_CODIFICADO>
```

* El mensaje deberá codificarse correctamente para URL antes de construir el enlace.
* El número de WhatsApp deberá provenir de configuración o variable de entorno, nunca estar duplicado manualmente en múltiples componentes.

---

## Gestión de Animaciones

Las animaciones estarán desacopladas de la lógica de negocio.

Ubicación:

```plaintext
src/components/animations/
```

Reglas:

* Utilizar GSAP únicamente cuando aporte valor visual real.
* Ejecutar las animaciones de GSAP con propiedades optimizadas para composición, usando `will-change` solo en los elementos que realmente se animan.
* Priorizar transformaciones GPU mediante `transform`, `translate3d`, `scale`, `rotate` y `opacity`.
* Evitar animar propiedades que afecten al layout o provoquen repintado, como `top`, `left`, `width`, `height`, `margin`, `padding` o `box-shadow`.
* Mantener animaciones reutilizables y configurables.

---

## Rendimiento y Carga Diferida

Las dependencias pesadas o asociadas a interacciones visuales deberán cargarse de forma diferida para no bloquear el First Contentful Paint.

### Reglas

* Cargar Mapbox de forma diferida mediante `next/dynamic` con `ssr: false`.
* Cargar componentes o módulos que dependan de GSAP de forma diferida mediante `next/dynamic` con `ssr: false` cuando no sean necesarios para el primer render.
* Evitar importar Mapbox o GSAP directamente en componentes críticos del above-the-fold si pueden cargarse bajo demanda.
* Mantener placeholders o estados de carga ligeros para los componentes dinámicos.

---

## Sistema de Diseño

Toda la interfaz deberá respetar el Design System definido para la barbería.

### Estándar Visual

La estética general será *dark luxury barbershop*, basada en una paleta sobria de tres colores principales.

#### Paleta

```plaintext
Fondo Base: #0F0F11
Color Primario / Acento: #C5A880
Texto y Superficie: #EDEDED
```

Uso esperado:

* `#0F0F11` como fondo base principal, negro carbón profundo mate y menos duro que `#000000`.
* `#C5A880` como color primario, acento, detalles premium, estados activos y llamadas a la acción.
* `#EDEDED` como color de texto principal, superficies claras puntuales y contraste de alta legibilidad.

#### Tipografía

* Títulos y textos display: serif moderna y elegante, como `Cormorant Garamond`, `Playfair Display` o `Cinzel`.
* Cuerpo, UI, formularios y reservas: sans-serif limpia y geométrica, como `Plus Jakarta Sans` o `Inter`.

### Reglas

* Uso exclusivo de la paleta corporativa.
* Tipografías definidas globalmente.
* Espaciados consistentes.
* Componentes reutilizables.
* Estados visuales homogéneos.

No se permitirán estilos aislados que rompan la coherencia visual del proyecto.

---

## Skills del Proyecto

Las habilidades disponibles viven en `.opencode/skills/` y se cargan automáticamente al abrir el proyecto con OpenCode.

| Skill | Cuándo se usa |
| :-- | :-- |
| `landing-page-design` | Al construir, editar, revisar o escribir copy de cualquier landing, sección, componente o página. Aporta el intake, la estructura de página, las reglas de copy de conversión, SEO/AEO y el sistema visual. |

Esta skill está **traducida al stack de este proyecto**: sin Tailwind, con las custom properties de `src/styles/globals.css` y con GSAP. Cuando una regla suya choque con este documento, manda este documento.

El historial de prompts con los que se construyó la web está en `PROMPTS.md`.

---

## Verificación

Antes de dar por terminado cualquier cambio, estas tres órdenes tienen que pasar:

```plaintext
pnpm lint
pnpm typecheck
pnpm build
```

---

## Principios Generales

Todo el desarrollo deberá seguir los siguientes principios:

* Código limpio y legible.
* Componentes reutilizables.
* Separación clara de responsabilidades.
* Evitar duplicación de lógica.
* Escalabilidad futura.
* Rendimiento como prioridad.
* Seguridad por defecto.
* Consistencia en toda la base de código.
