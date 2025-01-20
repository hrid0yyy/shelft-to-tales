import { API_BASE_URL } from "../config";

export async function allNotifications(userId) {
  try {
    // Replace the base URL with your server's address

    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/notification/fetch/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Optional, for APIs expecting JSON
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: error.message };
  }
}
