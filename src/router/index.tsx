import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./authRoutes";
// import errorsRoutes from "./errorsRoutes";
import { adminRoutes } from "./adminRoutes";

export const routes = [
  authRoutes,
  adminRoutes,
//   ...errorsRoutes,
];

export const router = createBrowserRouter(routes);
