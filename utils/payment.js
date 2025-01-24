import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/v1/user/payment`;

export const Init = async (userId, number, location, name, email) => {
  try {
    const response = await fetch(
      `${API_URL}/init?userId=${userId}&number=${number}&location=${location}&full_name=${name}&email=${email}`
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

export const placeOrder = async (userId, location) => {
  try {
    const response = await fetch(`${API_URL}/place-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        location,
      }),
    });

    // Handle the response
    const result = await response.json();
    if (response.ok) {
      // If the response is successful
      console.log("Order placed successfully:", result.message);
      return true;
    } else {
      // If the response is not successful
      console.error("Error placing order:", result.error);
      return false;
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error calling /place-order API:", error.message);
    return false;
  }
};
