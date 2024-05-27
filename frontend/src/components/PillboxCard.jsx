import { Link } from "react-router-dom";
import { convertTo12HourFormat } from "../utils/timeUtils";
import editIcon from "../assets/editIcon.svg";
import pillIcon from "../assets/pillIcon.svg";

export default function PillboxCard({ ...props }) {
  // console.log(props);
  const boxId = props.props.id;
  const boxNo = props.props.caseNo;
  const pillName = props.props.pillName;
  const doses = props.props.doses;
  const scheduleTimes = props.props.scheduleTimes;

  return (
    <div className="w-full md:w-1/2 lg:w-1/4 p-2">
      <div className="p-6 rounded-lg bg-white shadow-lg">
        <div className="flex mb-2 inline-block justify-between items-center">
          <div className="flex">
            <span className="mr-2 py-1">
              <img src={pillIcon} />
            </span>
            <h3 className="text-sm text-gray-600 py-1">Box {boxNo}</h3>
          </div>
          <Link
            to={`/pillbox/edit/${boxId}`}
            className="text-gray-500 bg-gray-50 rounded-md p-2 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <img src={editIcon} alt="Edit" />
          </Link>
        </div>
        <h2 className="mb-2 text-3xl font-semibold mb-4">{pillName}</h2>
        <span className="text-gray-400 text-xs flex mb-1">
          {doses} {doses > 1 ? "Tablets" : "Tablet"}
        </span>
        <span className="text-xs text-blue-500 flex">
          <span className="text-gray-400 text-xs inline-block">
            {scheduleTimes.map((time, index) => (
              <span key={index} className="text-gray-400 text-xs inline-block">
                {convertTo12HourFormat(time)}
                {index < scheduleTimes.length - 1 && <>&nbsp;/&nbsp;</>}
              </span>
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}
