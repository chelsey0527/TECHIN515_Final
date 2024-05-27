// components/SocialMediaTrafficChart.jsx

import React from "react";
import Chart from "react-apexcharts";

const SocialMediaTrafficChart = ({ data }) => {
  console.log(data.pillboxHumidity);
  const options = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
        dataLabels: {
          showOn: "always",
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    colors: ["#6366F1"],
    stroke: {
      lineCap: "round",
    },
  };

  const series = [`${data.pillboxHumidity}`];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="relative flex justify-center items-center">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={200}
        />
        <div className="absolute text-4xl">
          {data.pillboxHumidity <= 60 ? "😊" : "😨"}
        </div>
      </div>
      <div className="text-center">
        <h4 className="text-4xl font-bold text-indigo-500 mb-2">
          {data.pillboxHumidity}%
        </h4>
        <div className="text-center">
          <span className="mr-2 text-sm font-medium text-gray-500">
            Humidity
          </span>
          <span
            className={`py-1 px-2 rounded-full text-xs ${
              data.pillboxHumidity <= 60
                ? "bg-green-50 text-green-500"
                : "bg-red-50 text-red-500"
            }`}
          >
            {data.pillboxHumidity <= 60 ? "Good" : "Bad"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaTrafficChart;
