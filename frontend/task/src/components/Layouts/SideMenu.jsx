import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path === '/logout') {
      handleLogout();
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <div className="w-64 h-full bg-white shadow-md flex flex-col">
      <div className="flex flex-col items-center p-6 border-b border-gray-200">
        <img
          src={user?.profileImageUrl || '/default-profile.png'}
          alt="Profile"
          className="w-24 h-24  object-cover mb-2 border-2 border-white-300"
        />
        {user?.role === 'admin' && (
          <span className="text-xs text-gray-500 mb-1 uppercase font-medium tracking-wide">
            Admin
          </span>
        )}
        <h5 className="text-lg font-semibold text-gray-800 ">{user?.name || ''}</h5>
        <p className="text-sm text-gray-600">{user?.email || ''}</p>
      </div>

      <div className="flex-1 mt-6 overflow-y-auto">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`flex items-center w-full text-left px-6 py-3 mb-1 rounded-lg transition-colors duration-200 ${
              activeMenu === item.label
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleClick(item.path)}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
