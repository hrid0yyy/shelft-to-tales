export const formatDateTime = (dateTimeStr) => {
  // Parse the input datetime string into a Date object
  const date = new Date(dateTimeStr);

  // Format the date and time
  const options = {
    year: "numeric",
    month: "long", // Use 'short' or 'numeric' for different formats
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short", // Includes the timezone (e.g., GMT)
  };

  return date.toLocaleString("en-US", options); // Adjust 'en-US' to your locale
};
