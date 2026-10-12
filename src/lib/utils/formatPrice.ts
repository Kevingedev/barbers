const formatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR"
});

export function formatPrice(value: number) {
  return formatter.format(value);
}