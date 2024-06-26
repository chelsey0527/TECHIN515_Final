import { useEffect, useState } from "react";
import PillboxCard from "../components/Cards/PillboxCard";
import StorageEnvCard from "../components/Cards/StorageEnvCard";
import Loading from "../components/Loading";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = "https://techin515.azurewebsites.net";
const BASE_URL = "http://localhost:8080";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/dashboard/ee430f72-7def-434c-ade8-c464c04655b7`
        );
        const data = await response.json();
        setDashboardData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [dashboardData.data]);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setDashboardData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          pillboxHumidity: message.humidity,
          pillboxTemperature: message.temperature,
        },
      }));
    };

    // ws.onerror = (error) => {
    //   console.error("WebSocket Error:", error);
    // };

    // ws.onclose = () => {
    //   console.log("WebSocket Disconnected");
    // };

    return () => {
      ws.close();
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className=" h-full w-full bg-sky-50 ">
      <div className="px-6 pb-4 pt-10">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold">
            Welcome, {dashboardData.data?.name} 👋
          </h2>
        </div>
      </div>

      {/* Pillbox */}
      <h1 className="font-bold font-heading container mx-auto pt-8 px-10 text-4xl">
        Pill Box
      </h1>
      <section className="">
        <div className="container mx-auto">
          <div className="flex flex-wrap m-8">
            {dashboardData.data?.pillcases?.map((item, index) => (
              <PillboxCard key={index} props={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Storage Environment */}
      <h1 className="font-bold font-heading container mx-auto px-10 pt-8 text-4xl">
        Storage Environment
      </h1>
      <section className="py-3">
        <div className="container mx-auto">
          <div className="flex flex-wrap m-8">
            <StorageEnvCard
              props={{
                ...dashboardData.data,
                pillboxHumidity: dashboardData.data?.pillboxHumidity ?? "NaN",
                pillboxTemperature:
                  dashboardData.data?.pillboxTemperature ?? "NaN",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
