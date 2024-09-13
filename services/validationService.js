exports.validateInput = (domain, startingTime) => {
  if (!domain || !startingTime) {
    return { valid: false, message: "Domain and startingTime are required" };
  }

  // Regular expression to match yyyy-mm-dd format
  const dateRegex = /^\d{4}-(\d{2})-(\d{2})$/;

  // Check if startingTime matches the expected format
  const match = startingTime.match(dateRegex);
  if (!match) {
    return {
      valid: false,
      message: "Invalid startingTime format. Expected format: yyyy-mm-dd",
    };
  }

  const year = parseInt(startingTime.substring(0, 4), 10);
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);

  // Check if month is valid (01 to 12)
  if (month < 1 || month > 12) {
    return {
      valid: false,
      message: "Invalid month. Must be between 01 and 12.",
    };
  }

  // Check if day is valid for the given month
  const daysInMonth = new Date(year, month, 0).getDate(); // 0th day of the next month gives the last day of the current month
  if (day < 1 || day > daysInMonth) {
    return {
      valid: false,
      message: `Invalid day. Must be between 01 and ${daysInMonth} for the given month.`,
    };
  }

  const startDate = new Date(startingTime);
  if (isNaN(startDate.getTime())) {
    return { valid: false, message: "Invalid startingTime value" };
  }

  return { valid: true, startDate };
};
