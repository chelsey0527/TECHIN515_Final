import { convertTo12HourFormat } from "../../utils/timeUtils";

export default function IntakeHistoryTable({ data }) {
  const headers = [
    "Box number",
    "Medication",
    "Schedule Date",
    "Schedule Time",
    "Dose",
    "Status",
  ];
  // console.log("inside table", data);

  // console.log(data);

  return (
    <table className="table-auto w-full">
      <thead>
        <tr className="text-xs text-gray-500 text-left">
          {headers.map((item, index) => (
            <th key={index} className="pb-3 font-medium">
              {item}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => {
          const statusColor =
            item.status === "Completed"
              ? "bg-[#17BB84]"
              : item.status === "Missed"
              ? "bg-[#E85444]"
              : "bg-[#F67A28]";

          return (
            <tr
              key={index}
              className={`text-xs ${index % 2 === 0 ? "bg-gray-50" : ""}`}
            >
              <td className="py-5 px-6 font-medium">{item.caseNo}</td>
              <td className="font-medium">{item.pillName}</td>
              <td className="font-medium">{item.scheduleDate}</td>
              <td className="font-medium">
                {convertTo12HourFormat(item.scheduleTime)}
              </td>
              <td className="font-medium">{item.doses}</td>
              <td>
                <span
                  className={`inline-block py-1 px-2 text-white ${statusColor} rounded-full`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
