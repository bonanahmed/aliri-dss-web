function getDaysInSelectedMonth(dateData: Date) {
  const year = dateData.getFullYear();
  const month = dateData.getMonth() + 1; // Adding 1 because months are zero-based

  return new Date(year, month, 0).getDate();
}

const changeMonthToDate = (dateString: string) => {
  const year = parseInt(dateString.split("-")[0]);
  const month = parseInt(dateString.split("-")[1]) - 1; // Months are zero-based
  const day = 1; // You can set the day to any value, as long as it's a valid day of the month

  const dateObject = new Date(year, month, day);
  return dateObject;
};

export { getDaysInSelectedMonth, changeMonthToDate };
