import { useEffect, useState } from "react";
import PillboxCard from "../components/PillboxCard";
import StorageEnvCard from "../components/StorageEnvCard";

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
    return <div className=" h-screen w-full bg-gray-100 ">Loading...</div>;
  }

  return (
    <div className=" h-screen w-full bg-gray-100 ">
      <div className="px-6 pb-4 pt-10">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold">
            Welcome, {homeData.data?.name} 👋
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
            {homeData.data?.pillcases?.map((item, index) => (
              <PillboxCard key={index} props={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Device */}
      <h1 className="font-bold font-heading container mx-auto px-10 pt-8 text-4xl">
        Storage Environment
      </h1>
      <div className="container px-6 mx-auto">
        <section className="py-3">
          <StorageEnvCard
            props={{
              ...homeData.data,
              pillboxHumidity: homeData.data?.pillboxHumidity ?? "NaN",
              pillboxTemperature: homeData.data?.pillboxTemperature ?? "Nan",
            }}
          />
        </section>
      </div>
    </div>
  );
}
