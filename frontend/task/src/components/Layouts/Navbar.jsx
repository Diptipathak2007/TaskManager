import React, { useState } from "react";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow-md relative">
      {/* Left Section: Hamburger + Title */}
      <div className="flex items-center space-x-3">
        <button
          className="p-2 rounded-md hover:bg-blue-700 focus:outline-none text-2xl transition"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? "✖" : "☰"}
        </button>
        <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
          Task Manager
        </h2>
      </div>

      {/* Sidebar (mobile) */}
      {openSideMenu && (
        <div className="absolute top-16 left-0 w-64 h-screen bg-white shadow-lg border-r border-gray-200 z-50">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
