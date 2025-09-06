import React from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const { updateUser } = React.useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-start min-h-screen px-4 pt-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back
          </h3>
          <p className="text-gray-500 mb-6 text-center">Login to your account</p>
          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              type="text"
              placeholder="Enter your email"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-2"
            >
              Login
            </button>
          </form>
          <p className="text-gray-600 text-sm mt-4 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
