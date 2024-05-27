import { useEffect, useState } from "react";
import PillboxCard from "../components/PillboxCard";
// import StorageEnvCard from "../components/StorageEnvCard";
import HumidityChart from "../components/charts/HumidityChart";
import TemperatureLineChart from "../components/charts/TemperatureLineChart";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = "https://techin515.azurewebsites.net";
const BASE_URL = "http://localhost:8080";

export default function Dashboard() {
  // console.log(import.meta.env);
  // console.log(BASE_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [homeData, setHomeData] = useState({});

  useEffect(() => {
    const fetchHome = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/home/ee430f72-7def-434c-ade8-c464c04655b7`
        );
        const data = await response.json();
        setHomeData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, []);

  useEffect(() => {
    if (homeData.data) {
      // Ensuring data is there before logging
      // console.log("homeData has been updated:", homeData.data);
    }
  }, [homeData.data]); // Listening specifically to homeData.data

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setHomeData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          pillboxHumidity: message.humidity,
          pillboxTemperature: message.temperature,
        },
      }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  if (isLoading) {
    return <div className=" h-full w-full bg-sky-50 ">Loading...</div>;
  }

  return (
    <div className=" h-full w-full bg-sky-50 ">
      <div className="px-6 pb-4 pt-10">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold">
            Welcome, {homeData.data?.name} 👋
          </h2>
        </div>
      </div>

      {/* Pillbox */}
      <h1 className="font-semibold font-heading container mx-auto pt-8 px-10 text-4xl">
        Pill Box
      </h1>
      <section className="">
        <div className="container mx-auto">
          <div className="flex flex-wrap m-8">
            {homeData.data?.pillcases?.map((item, index) => (
              <PillboxCard key={index} props={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Storage Environment */}
      <h1 className="text-[#15181c] font-semibold font-heading container mx-auto px-10 pt-8 text-4xl">
        Storage Environment
      </h1>
      <section>
        <div className="container mx-auto">
          <div className="flex flex-wrap m-8">
            <div className="w-full h-1/2 lg:w-1/2 px-4">
              <HumidityChart
                data={{
                  pillboxHumidity: homeData.data?.pillboxHumidity ?? "NaN",
                }}
              />
            </div>

            <div className="w-full h-1/2 lg:w-1/2 px-4">
              {/* <TemperatureLineChart
                data={{
                  pillboxTemperatue: homeData.data?.pillboxTemperature ?? "NaN",
                }}
              /> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
