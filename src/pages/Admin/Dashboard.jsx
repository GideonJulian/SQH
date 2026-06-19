import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Layouts/Admin/AdminLayout";
import ProductListing from "./ProductListing";
import { setAdminAuthenticated } from "../../utils/adminAuth";


export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAdminAuthenticated(false);
    navigate("/admin/login", { replace: true });
  };

  return (
 <div>
  Dashboard
 </div>
  );
}
