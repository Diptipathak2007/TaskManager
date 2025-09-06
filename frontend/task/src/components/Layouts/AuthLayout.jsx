import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex w-screen h-screen">
      {/* Left Side - Form */}
      <div className="w-full md:w-[45vw] px-12 pt-8 pb-12 flex flex-col">
        <h2 className="text-lg font-medium text-black mb-8">Task Manager</h2>
        {children}
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-[55%] h-full items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2339&q=80"
          alt="Task Manager Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
