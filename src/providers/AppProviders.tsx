import type { ReactNode } from "react";

import ThemeProvider from "./ThemeProvider";
import RTLProvider from "./RTLProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import NotificationProvider from "./NotificationProvider";
import AppToastContainer from "./AppToastContainer";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <RTLProvider>
        <ReactQueryProvider>
          <NotificationProvider>{children}</NotificationProvider>
          <AppToastContainer />
        </ReactQueryProvider>
      </RTLProvider>
    </ThemeProvider>
  );
}