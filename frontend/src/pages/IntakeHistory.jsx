import { useEffect, useState, useCallback } from "react";
import IntakeHistoryTable from "../components/IntakeHistoryTable";
import Loading from "../components/Loading";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = "https://techin515.azurewebsites.net";
const BASE_URL = "http://localhost:8080";

export default function IntakeHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [intakeHistoryData, setIntakeHistoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchIntakeLogs = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/intakelog/ee430f72-7def-434c-ade8-c464c04655b7?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      return data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMoreRecords = async () => {
    const nextPage = page + 1;
    const moreData = await fetchIntakeLogs(nextPage);
    if (moreData.length < limit) {
      setHasMore(false); // No more records to load
    }
    setIntakeHistoryData((prevData) => [...prevData, ...moreData]);
    setPage(nextPage);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialData = await fetchIntakeLogs(1);
      setIntakeHistoryData(initialData);
    };

    fetchInitialData();
  }, [fetchIntakeLogs, hasMore]);

  if (isLoading && page === 1) {
    return <Loading />;
  }

  return (
    <div className="h-full w-full bg-sky-50 ">
      <div className="py-8 px-6">
        <div className="container px-4 mx-auto">
          <h2 className="font-bold text-4xl">Intake History</h2>
          <p className="mb-2 mb-2 font-heading container mt-2 mx-auto">
            Your record of medication history
          </p>
        </div>
      </div>
      <section className="pb-8">
        <div className="container mx-auto px-10">
          <div className="pt-4 bg-white shadow rounded">
            <div className="flex px-6 pb-4 border-b">
              <h3 className="text-xl font-bold">Your History</h3>
            </div>
            <div className="p-4 overflow-x-auto">
              <IntakeHistoryTable data={intakeHistoryData} />
              <div className="text-center mt-5">
                <button
                  className="inline-flex items-center text-xs text-indigo-500 hover:text-blue-600 font-medium"
                  onClick={loadMoreRecords}
                  disabled={isLoading || !hasMore}
                >
                  <span>Load more records</span>
                </button>
                {!hasMore && (
                  <div className="text-center mt-5 text-gray-500 text-xs">
                    No more records to load
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
