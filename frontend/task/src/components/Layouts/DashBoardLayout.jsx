import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from '../Layouts/Navbar'
import SideMenu from '../Layouts/SideMenu'

const DashBoardLayout = ({ children, activeMenu }) => {
  const user = useContext(UserContext)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navbar */}
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-md">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashBoardLayout
