import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/Layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";

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
        // TODO: transform and set pieChartData / barChartData if needed
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div>
        <div>
          <h2 className="">Welcome Back {user?.name}</h2>
          <p className="">{moment().format("dddd, MMMM Do YYYY")}</p>
        </div>
        {/* Example: Show dashboard summary if available */}
        {dashboardData && (
          <div className="mt-4">
            <p>Total Tasks: {dashboardData.totalTasks}</p>
            <p>Completed: {dashboardData.completedTasks}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
