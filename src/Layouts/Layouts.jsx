import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layouts = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
        <Outlet />
    </div>
  )
}

export default Layouts