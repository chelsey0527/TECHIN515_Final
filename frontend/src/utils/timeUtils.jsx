// Change from 24-hr-clock to 12-hr-clock
export const convertTo12HourFormat = (time24) => {
  // Filter format
  time24 = time24.replace(/'/g, "").split(":").slice(0, 2).join(":");
  let [hours, minutes] = time24.split(":");

  // Convert hours to 12-hour format
  hours = parseInt(hours, 10);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  // Construct the 12-hour format time string
  return `${hours}:${minutes} ${period}`;
};

// Change from 12-hr-clock to 24-hr-clock
export const convertTo24HourFormat = (time12) => {
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":");

  // Convert hours to 24-hour format
  hours = parseInt(hours, 10);
  if (modifier === "PM" && hours < 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }
  // Construct the 24-hour format time string
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};
