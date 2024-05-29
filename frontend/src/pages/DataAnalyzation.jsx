import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Chart from "react-apexcharts";
import moment from "moment-timezone";

const BASE_URL = "http://localhost:8080";

const DataAnalyzation = ({ userId }) => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyInsights = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/analyzation/ee430f72-7def-434c-ade8-c464c04655b7`
        );
        const data = await response.json();
        setInsights(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyInsights();
  }, [userId]);

  if (isLoading) {
    return <Loading />;
  }

  if (!insights) {
    return <div>No insights available</div>;
  }
  console.log("insights", insights);

  // Prepare data for missed medicines bar chart
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    moment().subtract(i, "days").format("YYYY-MM-DD")
  ).reverse();

  console.log("days", daysOfWeek);
  console.log(daysOfWeek.map((date) => date));

  const pillNamesSet = new Set();
  daysOfWeek.forEach((day) => {
    const pills = insights.missedCountByDayAndPill[day];
    if (pills) {
      Object.keys(pills).forEach((pillName) => {
        pillNamesSet.add(pillName);
      });
    }
  });
  const pillNames = Array.from(pillNamesSet);

  console.log("pill names ---- ", pillNames);

  const missedPillCountsByDay = daysOfWeek.map((date) => {
    return {
      date,
      counts: pillNames.map(
        (pillName) => insights.missedCountByDayAndPill[date]?.[pillName] || 0
      ),
    };
  });

  const missedPillsBarChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    title: {
      text: "Missed Medicines per Day",
      align: "left",
    },
    xaxis: {
      categories: daysOfWeek,
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " pills";
        },
      },
    },
    // colors: ["#382CDD", "#382CDD", "#E85444", "#17BB84"],
  };

  const missedPillsBarChartSeries = pillNames.map((pillName, index) => ({
    name: pillName,
    data: missedPillCountsByDay.map(
      (day) => day.counts[pillNames.indexOf(pillName)]
    ),
  }));

  console.log(pillNames);

  return (
    <div className="h-full w-full bg-sky-50 ">
      <div className="py-8 px-6">
        <div className="container px-4 mx-auto">
          <h2 className="font-bold text-4xl">Intake insights</h2>
          <p className="mb-2 font-heading container mt-2 mx-auto">
            Your Intake analyzation for the past 7 days
          </p>
        </div>
      </div>
      <section className="pb-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="w-full md:w-1/3 p-4">
              <div className="p-6 text-center bg-white shadow rounded-lg">
                <h3 className="mt-3 mb-1 text-3xl font-bold  text-[#17BB84]">
                  {insights.completedCount}
                </h3>
                <p className="text-sm font-medium">Completed</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="p-6 text-center bg-white shadow rounded-lg">
                <h3 className="mt-3 mb-1 text-3xl font-bold text-[#E85444]">
                  {insights.missedCount}
                </h3>
                <p className="text-sm  font-medium">Missed</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="p-6 text-center bg-white shadow rounded-lg">
                <h3 className="mt-3 mb-1 text-3xl font-bold ">
                  {insights.mostMissedPill}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  Most missed pill
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  p-4">
          <div className="p-6 bg-white shadow rounded-lg">
            <Chart
              options={missedPillsBarChartOptions}
              series={missedPillsBarChartSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataAnalyzation;
