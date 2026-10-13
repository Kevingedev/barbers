#!/usr/bin/env bash
# Crea .env.local a partir de .env.example sin pisar lo que ya existe.
#
#   bash scripts/setup-env.sh
#
# Qué hace: si .env.local no existe, lo copia de la plantilla. Si ya existe,
# añade solo las variables que falten y deja intactas las que ya están puestas.
# Nunca pisa un valor que ya exista, porque perder una clave no tiene arreglo.

set -u

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
ORIGEN="$RAIZ/.env.example"
DESTINO="$RAIZ/.env.local"

if [ ! -f "$ORIGEN" ]; then
  echo "No encuentro .env.example en $RAIZ"
  exit 1
fi

if [ ! -f "$DESTINO" ]; then
  cp "$ORIGEN" "$DESTINO"
  echo "Creado .env.local a partir de la plantilla."
else
  anadidas=0
  while IFS= read -r linea; do
    case "$linea" in
      ""|\#*) continue ;;
    esac
    clave="${linea%%=*}"
    if grep -q "^${clave}=" "$DESTINO" 2>/dev/null; then
      continue
    fi
    printf '\n%s\n' "$linea" >> "$DESTINO"
    anadidas=$((anadidas + 1))
  done < "$ORIGEN"

  echo ".env.local ya existía."
  if [ "$anadidas" -gt 0 ]; then
    echo "Añadidas $anadidas variables que faltaban."
  else
    echo "No faltaba ninguna."
  fi
  echo "Tus valores se han dejado intactos."
fi

echo
echo "Ahora rellena dentro de .env.local:"
echo "  NEXT_PUBLIC_SITE_MODE    static | full"
echo "  SUPABASE_URL             https://xxxx.supabase.co"
echo "  SUPABASE_ANON_KEY        la publishable"
echo "  NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER   tu número, solo dígitos"
echo "  NEXT_PUBLIC_MAPBOX_TOKEN             el pk.eyJ..."
echo
echo "Después, para activar el panel: bash scripts/setup-back.sh"