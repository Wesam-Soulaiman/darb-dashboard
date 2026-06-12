import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "dayjs/locale/ar";
import "dayjs/locale/en";

import ThemeProvider from "./ThemeProvider";
import RTLProvider from "./RTLProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import NotificationProvider from "./NotificationProvider";
import AppToastContainer from "./AppToastContainer";
import MyLocationProvider from "./MyLocationProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  const { i18n } = useTranslation();

  const adapterLocale = i18n.language.startsWith("ar") ? "ar" : "en";

  return (
    <ThemeProvider>
      <RTLProvider>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={adapterLocale}
        >
          <ReactQueryProvider>
            <MyLocationProvider autoRequest={false}>
              <NotificationProvider>{children}</NotificationProvider>
              <AppToastContainer />
            </MyLocationProvider>
          </ReactQueryProvider>
        </LocalizationProvider>
      </RTLProvider>
    </ThemeProvider>
  );
}