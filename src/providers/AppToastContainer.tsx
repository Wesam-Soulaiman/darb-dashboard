import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

import "react-toastify/dist/ReactToastify.css";

export default function AppToastContainer() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <ToastContainer
      position="top-center"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={4}
      rtl={isRtl}
      theme="colored"
    />
  );
}
