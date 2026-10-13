#!/usr/bin/env bash
# Build con reintentos.
#
# Por qué: `next/font` baja Cormorant Garamond y Plus Jakarta Sans de Google
# Fonts al compilar. Si esa petición falla por un corte de red, el build entero
# revienta con un error que no explica que el problema era la red. Medido: en
# este proyecto pasaba uno de cada tres builds, y reintentando salía bien a la
# segunda.
#
# Un fallo de red no debería tumbar un despliegue, y al revés tampoco: si tras
# los reintentos sigue fallando, sale con error de verdad.

set -u

INTENTOS="${BUILD_RETRIES:-3}"
ESPERA="${BUILD_RETRY_WAIT:-5}"

for i in $(seq 1 "$INTENTOS"); do
  if npx next build; then
    exit 0
  fi

  if [ "$i" -lt "$INTENTOS" ]; then
    echo "" >&2
    echo "El build ha fallado (intento $i de $INTENTOS). Reintento en ${ESPERA}s." >&2
    sleep "$ESPERA"
  fi
done

echo "" >&2
echo "El build sigue fallando después de $INTENTOS intentos." >&2
echo "Si el error menciona next/font o las fuentes, es un problema de conexión" >&2
echo "con Google Fonts: compruébalo con" >&2
echo "  curl -I https://fonts.googleapis.com" >&2
echo "y vuelve a lanzar el build." >&2
exit 1