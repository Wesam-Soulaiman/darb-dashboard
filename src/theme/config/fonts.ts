export type FontKey = "interCairo" | "robotoKufi" | "orbitronAmiri";

export const fontFamilies: Record<FontKey, { en: string; ar: string }> = {
  interCairo: {
    en: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    ar: "Cairo, 'Noto Kufi Arabic', 'Noto Sans Arabic', Arial, sans-serif",
  },
  robotoKufi: {
    en: "Roboto, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    ar: "'Noto Kufi Arabic', Cairo, 'Noto Sans Arabic', Arial, sans-serif",
  },
  orbitronAmiri: {
    en: "Orbitron, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    ar: "Amiri, Cairo, 'Noto Sans Arabic', Arial, sans-serif",
  },
};
