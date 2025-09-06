import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { UserContext, UserProvider } from "./context/userContext";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import CreateTask from "./pages/Admin/CreateTask";

// User Pages
import UserDashboard from "./pages/User/Dashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

// Auth Pages
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";

// Routes
import PrivateRoute from "./routes/PrivateRoutes";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
          </Route>

          {/* Fallback Route */}
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = React.useContext(UserContext);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "admin" 
    ? <Navigate to="/admin/dashboard" replace /> 
    : <Navigate to="/user/dashboard" replace />;
};
