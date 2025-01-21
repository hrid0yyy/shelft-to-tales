// client.js (or wherever you want to call the API)
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/v1/user/home`;

export async function fetchNewReleases() {
  try {
    const response = await fetch(`${API_URL}/new_release`);
    const result = await response.json();

    if (response.ok) {
      return result.data;
      // Handle the data, e.g., update state or render on the page
    } else {
      console.error("Error fetching new releases: ", result.error);
    }
  } catch (error) {
    console.error("Error fetching new releases:", error);
  }
}

export async function fetchDiscounts() {
  try {
    const response = await fetch(`${API_URL}/discount`);
    const result = await response.json();

    if (response.ok) {
      return result.data;
      // Handle the data, e.g., update state or render on the page
    } else {
      console.error("Error fetching discount books: ", result.error);
    }
  } catch (error) {
    console.error("Error fetching discount books:", error);
  }
}
