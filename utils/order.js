import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/v1/user/book`;
export async function fetchPurchaseHistory(userId) {
  try {
    const response = await fetch(
      `${API_URL}/purchase-history?userId=${userId}`
    );
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching purchase history:", error.message);
    return null;
  }
}

export async function fetchTrackOrder(userId) {
  try {
    const response = await fetch(`${API_URL}/track-order?userId=${userId}`);

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching track order:", error.message);

    return null;
  }
}
