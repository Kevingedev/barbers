type GenerateWhatsAppUrlParams = {
  phone: string;
  message: string;
};

export function generateWhatsAppUrl({ phone, message }: GenerateWhatsAppUrlParams) {
  const normalizedPhone = phone.replace(/[^\d]/g, "");
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}