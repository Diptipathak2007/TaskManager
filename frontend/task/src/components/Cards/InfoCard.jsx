import React from "react";

const InfoCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div
      className={`flex items-center justify-between p-6 rounded-2xl shadow-md border border-gray-100 bg-white hover:shadow-lg transition`}
    >
      {/* Left: Icon inside colored circle */}
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-full ${color} bg-opacity-10`}
      >
        {Icon && <Icon className={`w-7 h-7 ${color.replace("bg-", "text-")}`} />}
      </div>

      {/* Right: Label + Value */}
      <div className="text-right">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
