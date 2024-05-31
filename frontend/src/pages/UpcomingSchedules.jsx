import { useEffect, useState } from "react";
import { convertTo12HourFormat } from "../utils/timeUtils";
import Loading from "../components/Loading";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = "https://techin515.azurewebsites.net";
const BASE_URL = "http://localhost:8080";

export default function UpcomingSchedules() {
  const [isLoading, setIsLoading] = useState(false);
  const [nextSchedulesData, setNextSchedulesData] = useState({});

  const nextSchedule = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/upcoming/ee430f72-7def-434c-ade8-c464c04655b7`
      );
      const data = await response.json();
      setNextSchedulesData(data);
      // console.log("next:", data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    nextSchedule();
  }, []);

  useEffect(() => {
    // console.log(nextSchedulesData);
  }, [nextSchedulesData.data]); // Listening specifically to homeData.data

  const markAsDone = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/upcoming/${id}/done`, {
        method: "PATCH",
      });
      const data = await response.json();
      // console.log("Updated intake log:", data);
      nextSchedule();
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsDone = async () => {
    if (nextSchedulesData.message === "No upcoming schedules found") {
      window.alert("You already finish all schedules!");
      return;
    }
    const ids = nextSchedulesData.data.map((schedule) => schedule.id);
    try {
      const response = await fetch(`${BASE_URL}/upcoming/done`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });
      const data = await response.json();
      // console.log("All intake logs updated:", data);
      nextSchedule();
    } catch (e) {
      console.error(e);
    }
  };

  const updateScheduleTime = async () => {
    const ids = nextSchedulesData.data.map((schedule) => schedule.id);
    try {
      const response = await fetch(`${BASE_URL}/upcoming/update-time`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });
      const data = await response.json();
      nextSchedule();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-full w-full bg-sky-50 ">
      <div className="py-8 px-6">
        <div className="container px-4 mx-auto">
          <h2 className="font-bold text-4xl">Upcoming schedules</h2>
          <p className="mb-2 font-heading container mt-2 mx-auto">
            Your upcoming schedules
          </p>
        </div>
      </div>
      <section className="pb-8">
        <div className="container mx-auto px-10">
          <div className="pt-4 bg-white shadow rounded">
            <ul role="list" className="divide-y divide-gray-100 px-10">
              {nextSchedulesData.data?.map((schedule, index) => (
                <li key={index} className="flex justify-between gap-x-6 py-5">
                  <div className="flex-1 min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        Case #{schedule.caseNo}: {schedule.pillName}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        Doses: {schedule.doses}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">
                      <span className="font-bold">Scheduled Time: </span>{" "}
                      {convertTo12HourFormat(schedule.scheduleTime)}
                    </p>
                  </div>
                  <div className="flex-1 shrink-0 sm:flex sm:flex-col sm:items-end">
                    <button
                      className="inline-block w-full md:w-auto px-6 p-3 text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded transition duration-200"
                      onClick={() => markAsDone(schedule.id)}
                      type="button"
                    >
                      Done
                    </button>
                  </div>
                </li>
              ))}
              {nextSchedulesData.message && `No more schdules for today!`}
            </ul>
            <div className="flex justify-end py-4 px-10 border-t-[3px] border-blue-50 ">
              <button
                className="inline-block px-6 py-3 text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded transition duration-200"
                onClick={markAllAsDone}
              >
                All Done 🎉
              </button>
              <button
                className="inline-block px-6 py-3 ml-4 text-sm text-indigo-600 border-b-indigo-500 hover:bg-indigo-100 rounded transition duration-200"
                onClick={updateScheduleTime}
              >
                Update Schedule Time ⏱️
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
