import React, { useState } from 'react'
import SideMenu from './SideMenu'

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false)

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-200 text-white shadow-md relative">
      <button
        className="p-2 rounded-md hover:bg-gray-700 focus:outline-none text-2xl"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? '✖' : '☰'}
      </button>

      <h2 className="text-lg font-bold">Expense Tracker</h2>

      {openSideMenu && (
        <div className="absolute top-16 left-0 w-64 h-screen bg-slate-400 shadow-lg">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  )
}

export default Navbar
