import { useEffect, useState } from "react";
import PillboxCard from "../components/PillboxCard";

const BASE_URL = "http://localhost:8080";

export default function Dashboard() {
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
      console.log("homeData has been updated:", homeData.data);
    }
  }, [homeData.data]); // Listening specifically to homeData.data

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-full bg-gray-100 ">
      <div className="px-6 pb-4 pt-10">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold">Welcome, John Smith 👋</h2>
        </div>
      </div>

      {/* Pillbox */}
      <h1 className="font-bold font-heading container mx-auto pt-8 px-10 text-4xl">
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

      {/* Device */}
      <h1 className="font-bold font-heading container mx-auto px-10 pt-8 text-4xl">
        Device condition
      </h1>
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
          <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0 ml-6"></div>
          <div className="w-full md:w-2/3 px-4 mb-4 md:mb-0"></div>
        </div>
        <div className="flex flex-wrap px-4 mx-auto flex-col">
          <h2 className="ml-2 mr-2">
            Humidity: {homeData.data?.pillboxHumidity}
          </h2>
          <h2 className="ml-2 mr-2">
            Temperature: {homeData.data?.pillboxTemperature}
          </h2>
        </div>
      </div>
    </div>
  );
}