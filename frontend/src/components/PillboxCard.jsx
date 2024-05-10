import pillboxLogo from "../assets/pillbox-logo.svg";

export default function PillboxCard({ ...props }) {
  console.log(props);
  const caseNo = props.props.caseNo;
  const pillName = props.props.pillName;
  const doses = props.props.doses;

  return (
    <div className="w-full md:w-1/2 lg:w-1/4 p-2">
      <div className="p-6 rounded bg-white shadow-lg">
        <div className="flex mb-2">
          <img
            src={pillboxLogo}
            alt="pillbox-card-icon"
            className="inline-block mr-2"
          />
          <h3 className="text-sm text-gray-600 p-2">Box {caseNo}</h3>
          {/* TODO: still need to find a way to display time */}
          <span className="inline-block ml-auto px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-full">
            10AM
          </span>
        </div>
        <h2 className="mb-2 text-3xl font-bold">{pillName}</h2>
        <span className="text-gray-400 text-xs">{doses} Tablet</span>
      </div>
    </div>
  );
}
