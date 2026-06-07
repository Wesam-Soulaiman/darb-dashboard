import { useAuthContext } from "../../../contexts/AuthContext";
import CompanyUsersPage from "./company/CompanyUsersPage";
import SuperAdminUsersPage from "./super-admin/SuperAdminUsersPage";

const UsersPage = () => {
  const { isSuperAdmin, user } = useAuthContext();

  if (isSuperAdmin) {
    return <SuperAdminUsersPage />;
  }

  return (
    <CompanyUsersPage
      organizationId={user?.organizationId ?? null}
    />
  );
};

export default UsersPage;