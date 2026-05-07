import type { ReactNode } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useTranslation } from "react-i18next";

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const ltrCache = createCache({
  key: "muiltr",
  stylisPlugins: [prefixer],
});

type RTLProviderProps = {
  children: ReactNode;
};

const isArabicLanguage = (language: string) => {
  return language.toLowerCase().startsWith("ar");
};

export default function RTLProvider({ children }: RTLProviderProps) {
  const { i18n } = useTranslation();
  const isRtl = isArabicLanguage(i18n.resolvedLanguage || i18n.language);

  return (
    <CacheProvider value={isRtl ? rtlCache : ltrCache}>
      {children}
    </CacheProvider>
  );
}