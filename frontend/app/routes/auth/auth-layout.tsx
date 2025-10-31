import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const AuthLayout = () => {
  const { isLoaded, isSignedIn } = useUser();

  // ⏳ Wait until Clerk finishes loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium">
        Loading...
      </div>
    );
  }

  // ✅ If user already signed in → go to dashboard
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔹 If not signed in → show sign-in page layout
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Clerk buttons */}
      <header className="flex justify-end items-center gap-4 p-4 border-b bg-white shadow-sm">
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>

      {/* Main content (for nested routes like /auth/sign-in or /auth/sign-up) */}
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
