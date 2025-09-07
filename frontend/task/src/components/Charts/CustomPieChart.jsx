import React from 'react';
import CustomToolTip from './CustomToolTip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({ data, colors = ["#22c55e", "#facc15", "#ef4444"] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        <p>No data to display</p>
      </div>
    );
  }

  const dataWithPercentages = data.map((item, index) => ({
    ...item,
    percentage: ((item.count / total) * 100).toFixed(1),
    color: colors[index % colors.length]
  }));

  // Create conic gradient for pie chart
  let gradientStops = [];
  let currentPercentage = 0;

  dataWithPercentages.forEach(item => {
    const percentage = parseFloat(item.percentage);
    if (percentage > 0) {
      gradientStops.push(`${item.color} ${currentPercentage}% ${currentPercentage + percentage}%`);
      currentPercentage += percentage;
    }
  });

  const conicGradient = `conic-gradient(from 0deg, ${gradientStops.join(', ')})`;

  return (
    <div className="w-full h-[300px] flex flex-col items-center justify-center">
      {/* CSS Pie Chart */}
      <div className="relative mb-6 group">
        <div
          className="w-40 h-40 rounded-full relative"
          style={{ background: conicGradient }}
        >
          {/* Inner circle to create donut effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">{total}</div>
              <div className="text-xs text-gray-500">Tasks</div>
            </div>
          </div>

          {/* Optional: tooltip on hover */}
          <CustomToolTip data={dataWithPercentages} />
        </div>
      </div>

      {/* Custom Legend */}
      <CustomLegend data={dataWithPercentages} />
    </div>
  );
};

export default CustomPieChart;
