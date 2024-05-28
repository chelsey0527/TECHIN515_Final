import React from "react";
import Chart from "react-apexcharts";

const Loading = () => {
  const options = {
    chart: {
      type: "radialBar",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 2100,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
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

  // Dummy series value for loading animation
  const series = [100];

  return (
    <div className="h-full w-full bg-sky-50 flex items-center justify-center">
      <div className="relative flex justify-center items-center">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={200}
        />
      </div>
    </div>
  );
};

export default Loading;
