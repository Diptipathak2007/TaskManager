import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/Layouts/DashBoardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";
import { addThousandSeparator } from "../../utils/helper";

// Icons
import { ClipboardList, CheckCircle, Clock, Loader, ArrowRight } from "lucide-react";
import InfoCard from "../../components/Cards/InfoCard";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";

const COLORS = ["#22c55e", "#facc15", "#ef4444"]; // Green, Yellow, Red

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useUserAuth(); // Protect route

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);

        // Prepare pie chart data
        const taskDistribution = response.data?.charts?.taskDistribution || {};
        const pieData = [
          { status: "Completed", count: taskDistribution?.Completed || 0 },
          { status: "In Progress", count: taskDistribution?.InProgress || 0 },
          { status: "Pending", count: taskDistribution?.Pending || 0 },
        ];
        setPieChartData(pieData);
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
      <div className="p-4 sm:p-6 space-y-6">

        {/* Greeting + Stats Card */}
        <div className="bg-blue-500 text-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {user?.name || "User"} 👋
              </h2>
              <p className="text-sm sm:text-base opacity-90 mt-1">
                {moment().format("dddd, MMMM Do YYYY")}
              </p>
            </div>
          </div>

          {/* InfoCards Stats */}
          {dashboardData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <InfoCard
                icon={ClipboardList}
                label="Total"
                value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
                color="bg-blue-600"
              />
              <InfoCard
                icon={CheckCircle}
                label="Completed"
                value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
                color="bg-green-600"
              />
              <InfoCard
                icon={Loader}
                label="In Progress"
                value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
                color="bg-yellow-500"
              />
              <InfoCard
                icon={Clock}
                label="Pending"
                value={addThousandSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
                color="bg-red-600"
              />
            </div>
          )}
        </div>

        {/* Task Distribution Pie Chart */}
        {dashboardData && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">
              Task Distribution Chart
            </h5>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        )}

        {/* Recent Tasks Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold text-gray-800">
              Recent Tasks
            </h5>
            <button
              onClick={() => navigate("/tasks")}
              className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              See All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
