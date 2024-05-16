// Change from 24-hr-clock to 12-hr-clock
export const convertTo12HourFormat = (time24) => {
  let [hours, minutes] = time24.split(":");
  hours = parseInt(hours, 10);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
};
