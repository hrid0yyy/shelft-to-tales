import { API_BASE_URL } from "../config";

// Function to call the /add API using fetch
export const addToCart = async (userId, bookId) => {
  try {
    // Validate input parameters
    if (!userId || !bookId) {
      throw new Error("userId and bookId are required");
    }

    // Make the API call
    const response = await fetch(`${API_BASE_URL}/api/v1/user/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, bookId }),
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add book to cart");
    }

    const data = await response.json();

    // Handle success response
    if (data.success) {
      console.log("Book successfully added to cart");
      return data;
    } else {
      throw new Error(data.error || "Failed to add book to cart");
    }
  } catch (error) {
    // Handle errors
    console.error("Error adding book to cart:", error.message);
    return { success: false, error: error.message };
  }
};

// Function to call the /update API using fetch
export async function updateCart(cartId, operation) {
  // Validate input
  if (!cartId || !["plus", "minus"].includes(operation)) {
    console.error(
      "Invalid input: cartId and valid operation (plus/minus) are required"
    );
    return;
  }

  try {
    // Call the API
    const response = await fetch(`${API_BASE_URL}/api/v1/user/cart/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId, operation }),
    });

    // Parse the response
    const result = await response.json();

    if (response.ok && result.success) {
      console.log(result.message);
      return result; // Return result for further use if needed
    } else {
      console.error("Error updating cart:", result.error);
    }
  } catch (error) {
    console.error("Error calling the API:", error.message);
  }
}

// Function to call the /fetch API using fetch
export const fetchCart = async (userId) => {
  try {
    // Validate input parameter
    if (!userId) {
      throw new Error("userId is required");
    }

    // Make the API call
    const response = await fetch(`${API_BASE_URL}/api/v1/user/cart/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch cart");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    return { success: false, error: error.message };
  }
};
