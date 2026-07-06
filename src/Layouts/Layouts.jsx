import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

const Layouts = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <Outlet />
      <div>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layouts;
