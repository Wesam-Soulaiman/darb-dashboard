export function normalizeSyrianPhone(phone: string): string {
  const value = phone.replace(/\s+/g, "").replace(/-/g, "");

  if (value.startsWith("+963")) {
    return value.replace("+", "");
  }

  if (value.startsWith("963")) {
    return value;
  }

  if (value.startsWith("09")) {
    return `963${value.slice(1)}`;
  }

  return value;
}

export function formatSyrianPhone(phone: string): string {
  const normalized = normalizeSyrianPhone(phone);

  if (/^9639\d{8}$/.test(normalized)) {
    return `+${normalized}`;
  }

  return phone;
}

export function isValidSyrianMobile(phone: string): boolean {
  const normalized = normalizeSyrianPhone(phone);

  return /^9639\d{8}$/.test(normalized);
}
