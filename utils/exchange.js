import { API_BASE_URL } from "../config";

export const addExchangeBook = async (
  userId,
  title,
  location,
  description,
  prefItem,
  image
) => {
  try {
    // Define the API endpoint
    const endpoint = `${API_BASE_URL}/api/v1/user/exchange/add`; // Replace with your actual server URL

    // Create the request body
    const requestBody = {
      userId,
      title,
      location,
      description,
      prefItem,
      image,
    };

    // Make the POST request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Parse the response
    const result = await response.json();

    if (response.ok) {
      return true;
    } else {
      console.error("API Error:", result.error);
    }
  } catch (error) {
    console.error("Network Error:", error.message);
  }
};
export const fetchSearchResults = async (userId, search = null) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/exchange/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, search }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      return result.data; // Return the search results
    } else {
      console.error("API Error:", result.error);
      return [];
    }
  } catch (error) {
    console.error("Network Error:", error.message);
    return [];
  }
};

export const filterResults = async (userId, search) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/exchange/filter`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, search }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      return result.data; // Return the search results
    } else {
      console.error("API Error:", result.error);
      return [];
    }
  } catch (error) {
    console.error("Network Error:", error.message);
    return [];
  }
};

export const fetchExchangeBooks = async (userId) => {
  try {
    // Define the API endpoint
    const endpoint = `${API_BASE_URL}/api/v1/user/exchange/fetch`;

    // Create the request body
    const requestBody = { userId };

    // Make the POST request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Parse the response
    const result = await response.json();

    if (response.ok) {
      return result.data; // Return the fetched data
    } else {
      console.error("API Error:", result.error);
    }
  } catch (error) {
    console.error("Network Error:", error.message);
  }
};

export const fetchExchangeBookDetails = async (exchangeId) => {
  try {
    if (!exchangeId) {
      throw new Error("Exchange ID is required");
    }

    // Construct the URL with the query parameter
    const url = `${API_BASE_URL}/api/v1/user/exchange/details?exchangeId=${exchangeId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      return result.data; // Return the details
    } else {
      throw new Error(result.error || "Failed to fetch exchange book details.");
    }
  } catch (error) {
    console.error("Network or API Error:", error.message);
    throw error; // Re-throw the error for the caller to handle
  }
};

export async function sendExchangeRequest(senderEid, receiverEid) {
  const apiUrl = `${API_BASE_URL}/api/v1/user/exchange/send`; // Replace <API_BASE_URL> with your actual API base URL

  try {
    // Make the POST request
    const response = await fetch(
      `${apiUrl}?sender_eid=${senderEid}&receiver_eid=${receiverEid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check the response status
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send exchange request");
    }

    // Parse and return the response data
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling /send API:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getExchangeRequests(receiverId) {
  const apiUrl = `${API_BASE_URL}/api/v1/user/exchange/requests`; // Replace <API_BASE_URL> with your actual API base URL

  try {
    // Make the GET request with receiver_id as a query parameter
    const response = await fetch(`${apiUrl}?p_receiver_id=${receiverId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check the response status
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch exchange requests");
    }

    // Parse and return the response data
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling /requests API:", error.message);
    return { success: false, error: error.message };
  }
}

export async function respondToExchangeRequest(
  senderEid,
  receiverEid,
  response
) {
  const apiUrl = `${API_BASE_URL}/api/v1/user/exchange/response`; // Replace <API_BASE_URL> with your actual API base URL

  try {
    // Make the POST request
    const responseObj = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_eid: senderEid,
        receiver_eid: receiverEid,
        response,
      }),
    });

    // Check the response status
    if (!responseObj.ok) {
      const errorData = await responseObj.json();
      throw new Error(
        errorData.error || "Failed to respond to exchange request"
      );
    }

    // Parse and return the response data
    const result = await responseObj.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error calling /response API:", error.message);
    return { success: false, error: error.message };
  }
}
