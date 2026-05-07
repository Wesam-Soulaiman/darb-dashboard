import CryptoJS from "crypto-js";

const APP_KEY = import.meta.env.VITE_APP_KEY;

function hasEncryptionKey(): boolean {
  return typeof APP_KEY === "string" && APP_KEY.trim().length > 0;
}

export function encryptValue(value: string): string {
  if (!hasEncryptionKey()) {
    if (import.meta.env.DEV) {
      console.warn("Missing env value: VITE_APP_KEY");
    }

    return value;
  }

  try {
    return CryptoJS.AES.encrypt(value, APP_KEY).toString();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Encryption failed:", error);
    }

    return value;
  }
}

export function decryptValue(encryptedValue: string): string | null {
  if (!encryptedValue) return null;

  if (!hasEncryptionKey()) {
    if (import.meta.env.DEV) {
      console.warn("Missing env value: VITE_APP_KEY");
    }

    return encryptedValue;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, APP_KEY);
    const originalValue = bytes.toString(CryptoJS.enc.Utf8);

    return originalValue || null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Decryption failed:", error);
    }

    return null;
  }
}
