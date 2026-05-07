import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const SUPPORTED_LANGS = ["ar", "en"] as const;

type Lang = (typeof SUPPORTED_LANGS)[number];

const LANGUAGE_STORAGE_KEY = "lng";

const isSupportedLang = (lng: string | undefined | null): lng is Lang => {
  return !!lng && SUPPORTED_LANGS.includes(lng as Lang);
};

const getInitialLang = (): Lang => {
  const localStorageLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isSupportedLang(localStorageLang)) {
    return localStorageLang;
  }

  return "ar";
};

const applyDocumentDirection = (lng: Lang) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
};

const initialLang = getInitialLang();

applyDocumentDirection(initialLang);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLang,
    fallbackLng: "en",

    supportedLngs: SUPPORTED_LANGS,
    nonExplicitSupportedLngs: true,

    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },

    react: {
      useSuspense: false,
    },

    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  if (!isSupportedLang(lng)) return;

  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  applyDocumentDirection(lng);
});

export default i18n;
