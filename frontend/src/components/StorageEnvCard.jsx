import humidityIcon from "../assets/humidityIcon.svg";
import temperatureIcon from "../assets/temperatureIcon.svg";

export default function storageCard({ ...props }) {
  const humidity = props.props.pillboxHumidity;
  const temperature = props.props.pillboxTemperature;
  console.log(props);

  return (
    <div className="container px-4 mx-auto">
      <div className="flex flex-wrap -m-4">
        <div className="w-full md:w-1/2 p-4">
          <div className="p-6 text-center bg-white shadow rounded-lg">
            <span className="inline-block mx-auto">
              <img classNameName="w-10" src={humidityIcon} />
            </span>
            <h3 className="mt-3 mb-1 text-3xl font-bold">{humidity}</h3>
            <p className="text-sm text-gray-600 font-medium">Room Humidity</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <div className="p-6 text-center bg-white shadow rounded-lg">
            <span className="inline-block mx-auto">
              <img classNameName="w-10" src={temperatureIcon} />
            </span>
            <h3 className="mt-3 mb-1 text-3xl font-bold">{temperature}</h3>
            <p className="text-sm text-gray-600 font-medium">
              Room Temperature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
