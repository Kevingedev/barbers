const formatter = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit"
});

export function formatDateTime(isoString: string) {
  return formatter.format(new Date(isoString));
}