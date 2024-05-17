import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { convertTo24HourFormat } from "../utils/timeUtils";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PillboxEdit() {
  const { boxId } = useParams();
  const [boxNo, setBoxNo] = useState();
  const [pillName, setPillName] = useState();
  const [doses, setDoses] = useState();
  const [scheduleTimes, setScheduledTimes] = useState([]);

  useEffect(() => {
    const fetchPillCaseById = async () => {
      try {
        const response = await fetch(`${BASE_URL}/pillcases/${boxId}`);
        const data = await response.json();
        setBoxNo(data.data.caseNo);
        setPillName(data.data.pillName);
        setDoses(data.data.doses);
        const formattedTimes = data.data.scheduleTimes.map(
          (time) => convertTo24HourFormat(time) // Remove single quotes and convert
        );
        setScheduledTimes([
          ...formattedTimes,
          ...Array(3 - formattedTimes.length).fill(""),
        ]);
      } catch (e) {
        console.error(e);
      } finally {
      }
    };

    fetchPillCaseById();
  }, []);

  // Update data by Id
  const updatePillcaseById = async (event) => {
    event.preventDefault(); // Prevent the form from submitting the default way
    const filteredTimes = scheduleTimes.filter((time) => time !== ""); // Only send times that have been set
    try {
      await fetch(`${BASE_URL}/pillcases/${boxId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pillName,
          doses: parseInt(doses, 10), // Ensure doses is an integer
          scheduleTimes: filteredTimes,
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

  const handleDosesChange = (event) => {
    setDoses(event.target.value);
  };

  console.log(pillName, boxNo, scheduleTimes);

  return (
    <div className=" h-full w-full bg-sky-50 ">
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

              {/* Doses */}
              <label className="block text-sm font-medium">
                Doses
                <span className="text-xs text-red-500"> *Required</span>
              </label>
              <input
                className="block w-full px-4 py-3 mb-6 text-sm placeholder-gray-500 bg-white border rounded mb-5"
                type="text"
                name="doses"
                value={`${doses}`}
                onChange={handleDosesChange}
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
                  </div>
                </div>
              ))}

              {/* Submit button */}
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
