import React from "react";
import Chart from "react-apexcharts";

const TemperatureLineChart = ({ data }) => {
  console.log(data.pillboxTemperatue);
  const options = {
    chart: {
      id: "temperature-chart",
    },
    xaxis: {
      type: "datetime",
      categories: data.pillboxTemperatue.map((entry) => entry.time),
    },
    yaxis: {
      title: {
        text: "Temperature (°C)",
      },
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Temperature Over Time",
      align: "left",
    },
  };

  const series = [
    {
      name: "Temperature",
      data: data.pillboxTemperatue.map((entry) => entry.temperature),
    },
  ];

  return (
    <div className="temperature-chart-card">
      <Chart options={options} series={series} type="line" height="300" />
    </div>
  );
};

export default TemperatureLineChart;
