export function formatDateTime(timestamp) {
  const date = new Date(timestamp); // Convert ISO string to Date object

  // Define options for custom formatting
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format (AM/PM)
    month: "short", // Abbreviated month (e.g., Jan)
    day: "numeric", // Day of the month
    year: "numeric", // Full year (e.g., 2025)
  };

  // Format the date and return the custom string
  const formattedTime = date.toLocaleString("en-US", options);

  // Return in the format "7:20 PM, Jan 20, 2025"
  return formattedTime.replace(",", ",");
}
