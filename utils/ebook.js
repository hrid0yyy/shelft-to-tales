import { API_BASE_URL } from "../config";

export const InitEbook = async (userId, bookId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/payment/init-ebook?userId=${userId}&bookId=${bookId}`
    );
    // Parse the response JSON even if the status is not OK
    const data = await response.json();

    // Return the data if no error
    return data;
  } catch (error) {
    console.error("Error calling /init API:", error.message);
    throw error;
  }
};

export const grantAccess = async (userId, bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/ebooks/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, bookId }),
    });

    const result = await response.json();
    console.log(result);
    if (response.ok) {
      console.log("Access granted successfully:", result.message);
      return { success: true, message: result.message };
    } else {
      console.error("Failed to grant access:", result.message);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Error calling grantAccess API:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
};

export const fetchEbooks = async (search, sort) => {
  try {
    // Validate input

    // API URL
    const apiUrl = `${API_BASE_URL}/api/v1/user/ebooks/fetch`; // Replace with your actual API endpoint

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search, sort }),
    });

    // Parse the JSON response
    const result = await response.json();

    // Handle API errors
    if (!response.ok) {
      throw new Error(result.error || "Failed to Ebooks");
    }

    // Return the reviews data
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error fetching Ebooks:", error.message);
    return { success: false, error: error.message };
  }
};
export async function getEbooks(userId, search = "") {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/ebooks/get_ebooks?userId=${userId}&search=${search}`
    );
    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      // If the request failed, handle the error
      console.error("Error fetching ebooks:", data.message || data.error);
      return null;
    }
  } catch (error) {
    console.error("Error in getEbooks function:", error);
    return null;
  }
}

export async function updatePage(userId, bookId, pageAt) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/ebooks/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, bookId, pageAt }),
    });

    const data = await response.json();

    if (response.status === 200 && data.success) {
      // If the update was successful, return a success message
      return true;
    } else {
      // If there was an error with the update, handle it
      console.error("Error updating page:", data.error || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Error in updatePage function:", error);
    return false;
  }
}
