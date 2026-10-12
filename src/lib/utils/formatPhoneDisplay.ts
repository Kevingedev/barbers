export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, "");

  if (cleaned.length < 3) {
    return phone;
  }

  const country = cleaned.slice(0, 2);
  const rest = cleaned.slice(2).replace(/(\d{3})(?=\d)/g, "$1 ");

  return `+${country} ${rest}`;
}