import React from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import PhotoProfile from "../../components/Inputs/PhotoProfile";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";

const SignUp = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [adminInviteCode, setAdminInviteCode] = React.useState("");
  const [profilePic, setProfilePic] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { updateUser } = React.useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Full Name is required");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("adminInviteCode", adminInviteCode || "");
      if (profilePic) formData.append("profilePic", profilePic);

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center items-start min-h-screen px-4 pt-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Create Account
          </h3>
          <p className="text-gray-500 mb-6 text-center">
            Sign up to manage your tasks
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Profile picture upload */}
            <PhotoProfile image={profilePic} setImage={setProfilePic} />

            {/* Name + Email (side by side on md+) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                type="text"
                placeholder="Enter your email"
              />
            </div>

            {/* Password + Confirm Password (side by side on md+) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            {/* Admin code (full width always) */}
            <Input
              value={adminInviteCode}
              onChange={(e) => setAdminInviteCode(e.target.value)}
              label="Admin Invite Code (Optional)"
              type="text"
              placeholder="Enter admin code if you have one"
            />

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white transition duration-300 mt-4 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-gray-600 text-sm mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
