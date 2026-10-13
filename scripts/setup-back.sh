#!/usr/bin/env bash
# Prepara las migraciones del panel.
#
# Qué hace: comprueba que las variables de Supabase estén puestas y avisa de lo
# que falta. NO ejecuta nada contra la base de datos ni pide la service_role:
# las migraciones se aplican desde el SQL Editor de Supabase, así que aquí solo
# se comprueba que todo está listo.
#
#   bash scripts/setup-back.sh

set -u

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
ENV="$RAIZ/.env.local"
fallos=0

leer() {
  # Devuelve el valor de una variable del .env.local
  grep "^$1=" "$ENV" 2>/dev/null | head -1 | cut -d= -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

echo "Comprobando .env.local…"
if [ ! -f "$ENV" ]; then
  echo "  No existe. Créalo con: bash scripts/setup-env.sh"
  exit 1
fi

# --- Variables ---------------------------------------------------------------
echo
echo "Variables:"

modo="$(leer NEXT_PUBLIC_SITE_MODE)"
if [ -z "$modo" ]; then
  echo "  NEXT_PUBLIC_SITE_MODE      falta"
  fallos=$((fallos + 1))
elif [ "$modo" = "full" ]; then
  echo "  NEXT_PUBLIC_SITE_MODE      full"
else
  echo "  NEXT_PUBLIC_SITE_MODE      '$modo'  (para el panel hace falta 'full')"
  fallos=$((fallos + 1))
fi

url="$(leer SUPABASE_URL)"
if [ -z "$url" ]; then
  echo "  SUPABASE_URL               falta"
  fallos=$((fallos + 1))
elif echo "$url" | grep -qE '^https://[a-z0-9]+\.supabase\.co$'; then
  echo "  SUPABASE_URL               ok"
else
  echo "  SUPABASE_URL               con forma rara: $url"
  fallos=$((fallos + 1))
fi

clave="$(leer SUPABASE_ANON_KEY)"
if [ -z "$clave" ]; then
  echo "  SUPABASE_ANON_KEY          falta"
  fallos=$((fallos + 1))
else
  echo "  SUPABASE_ANON_KEY          ok"
fi

# --- Correo de la lista blanca ----------------------------------------------
echo
echo "Lista de acceso al panel:"
CORREO_PLACEHOLDER="TU-CORREO@GMAIL.COM"
MIG="$RAIZ/supabase/migrations/20260919250000_back_policies.sql"
if grep -q "$CORREO_PLACEHOLDER" "$MIG" 2>/dev/null; then
  echo "  Falta poner tu correo en $MIG"
  echo "  Con esto sin cambiar, NADIE puede entrar al panel."
  fallos=$((fallos + 1))
else
  echo "  correo cambiado"
fi

# --- Migraciones por aplicar -------------------------------------------------
echo
echo "Migraciones por aplicar, en este orden:"
for f in "$RAIZ"/supabase/migrations/*.sql; do
  [ -e "$f" ] || continue
  echo "  $(basename "$f")"
done

echo
echo "  Pégalas en Supabase → SQL Editor → New query, una por una."
echo "  Comprueba que cada una sale sin error antes de seguir con la siguiente."

echo
if [ "$fallos" -gt 0 ]; then
  echo "Faltan $fallos cosas. Arriba están indicadas."
  exit 1
fi

echo "Todo listo. Aplica las migraciones y ya puedes entrar en /back."
echo "No olvides: crear el usuario en Supabase → Authentication → Users."