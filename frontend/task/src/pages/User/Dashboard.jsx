import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/Layouts/DashBoardLayout';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPath';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useUserAuth(); // to protect the route

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        // optionally process pieChartData and barChartData from response here
      }
    } catch (error) {
      console.log('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* You can render dashboardData here */}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <pre>{}</pre>
    </DashboardLayout>
  );
};

export default Dashboard;
