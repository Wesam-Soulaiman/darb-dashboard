import { Outlet } from "react-router-dom";

import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { adminMenuItems } from "../../menu-items/adminMenuItems";
import { useFilteredMenu } from "../../utils/useFilteredMenu";

export default function AdminLayout() {
  const filteredMenuItems = useFilteredMenu(adminMenuItems);

  return (
    <DashboardLayout sidebarItems={filteredMenuItems}>
      <Outlet />
    </DashboardLayout>
  );
} 