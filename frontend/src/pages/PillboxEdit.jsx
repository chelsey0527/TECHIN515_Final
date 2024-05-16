import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  convertTo12HourFormat,
  convertTo24HourFormat,
} from "../utils/timeUtils";
import dropdowIcon from "../assets/dropdownIcon.svg";
import MainButton from "./Button/MainButton";

const BASE_URL = "http://localhost:8080";

export default function PillboxEdit() {
  const { boxId } = useParams();
  const [pillcaseData, setPillcaseData] = useState({});
  const [pillName, setPillName] = useState();
  const [boxNo, setBoxNo] = useState();
  const [scheduleTimes, setScheduledTimes] = useState([]);

  useEffect(() => {
    const fetchPillCaseById = async () => {
      try {
        const response = await fetch(`${BASE_URL}/pillcases/${boxId}`);
        const data = await response.json();
        setPillcaseData(data);
        setPillName(data.data.pillName);
        setBoxNo(data.data.caseNo);
        const formattedTimes = data.data.scheduleTimes.map(
          (time) => convertTo24HourFormat(time.replace(/'/g, "")) // Remove single quotes and convert
        );
        setScheduledTimes(formattedTimes);
      } catch (e) {
        console.error(e);
      } finally {
      }
    };

    fetchPillCaseById();
  }, []);

  const updatePillcaseById = async (event) => {
    event.preventDefault(); // Prevent the form from submitting the default way
    try {
      await fetch(`${BASE_URL}/pillcases/${boxId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pillName,
          scheduleTimes,
        }),
      });
      alert("Update successful!");
    } catch (e) {
      console.error("Failed to update pill case:", e);
      alert("Update failed!");
    }
  };

  const handleTimeChange = (index, event) => {
    const newTimes = [...scheduleTimes];
    newTimes[index] = event.target.value;
    setScheduledTimes(newTimes);
  };

  const handlePillNameChange = (event) => {
    setPillName(event.target.value);
  };

  console.log(pillName, boxNo, scheduleTimes);

  return (
    <div className=" h-screen w-full bg-gray-100 ">
      <div className="px-6 pb-4 pt-10">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold">Medication Information</h2>
        </div>
      </div>

      <p className="mb-2 mb-2 font-heading container px-10 mx-auto">
        Please fill out the follwing form
      </p>
      <div className="container mx-auto mx-2">
        <div className="flex flex-wrap m-8">
          <div className="w-full bg-white px-6 py-8 mb-4">
            <form onSubmit={updatePillcaseById} className="">
              {/* Box number */}
              <div className="mb-6">
                <label className="block text-sm font-medium">Box #</label>
                <div className="relative">
                  <input
                    className="appearance-none block w-full px-4 py-3 mb-2 text-sm text-gray-400 border rounded"
                    type="text"
                    name="boxNo"
                    value={`${boxNo}`}
                    disabled
                  />
                </div>
              </div>
              {/* Medication name */}
              <label className="block text-sm font-medium">
                Medication Name
                <span className="text-xs text-red-500"> *Required</span>
              </label>
              <input
                className="block w-full px-4 py-3 mb-6 text-sm placeholder-gray-500 bg-white border rounded mb-5"
                type="text"
                name="pillName"
                value={`${pillName}`}
                onChange={handlePillNameChange}
              />
              {/* Schedule Times */}
              <span className="text-xs text-red-500"> *Required</span>
              {scheduleTimes.map((time, index) => (
                <div key={index} className="mb-2">
                  <label
                    htmlFor="time"
                    className="flex text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select time {index + 1}:
                  </label>
                  <div className="flex">
                    <input
                      type="time"
                      id={`time-${index}`}
                      className="rounded-none rounded-s-lg text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm p-2.5 border"
                      min="00:00"
                      max="23:59"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e)}
                      required=""
                    />
                    {/* <button
                      id="dropdown-duration-button"
                      data-dropdown-toggle="dropdown-duration"
                      className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 border rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 border bg-gray-50"
                      type="button"
                    >
                      Intake Duration
                      <img
                        className="ml-2"
                        src={dropdowIcon}
                        alt="Dropdown Icon"
                      />
                    </button>
                    <div
                      id="dropdown-duration"
                      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdown-duration-button"
                      >
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            30 minutes
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            1 hour
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            2 hours
                          </button>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                </div>
              ))}
              <h5 className="text-gray-500 text-sm py-1">
                Note: Your dose will appear missing on the intake history, if
                it's after the intake duration.
              </h5>
              <button
                className="inline-block w-full md:w-auto mt-10 px-6 p-3 font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded transition duration-200"
                type="submit"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
