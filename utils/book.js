import { API_BASE_URL } from "../config";

export const toggleWishlist = async (bookId, userId) => {
  try {
    // Validate inputs
    if (!bookId || !userId) {
      throw new Error("Both bookId and userId are required");
    }

    // API endpoint
    const url = `${API_BASE_URL}/api/v1/user/book/wishlist/toggle`; // Replace with your actual API URL

    // Make the API request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, userId }), // Send data to the API
    });

    // Parse the response
    const result = await response.json();

    // Check for API errors
    if (!response.ok) {
      throw new Error(result.error || "Failed to toggle wishlist");
    }

    // Return the result
    return result;
  } catch (error) {
    // Handle and log the error
    console.error("Error toggling wishlist:", error.message);
    return { success: false, error: error.message };
  }
};

export const fetchReviews = async (bookId) => {
  try {
    // Validate input
    if (!bookId) {
      throw new Error("bookId is required");
    }

    // API URL
    const apiUrl = `${API_BASE_URL}/api/v1/user/book/reviews`; // Replace with your actual API endpoint

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId }),
    });

    // Parse the JSON response
    const result = await response.json();

    // Handle API errors
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch reviews");
    }

    // Return the reviews data
    return result;
  } catch (error) {
    // Handle errors
    console.error("Error fetching reviews:", error.message);
    return { success: false, error: error.message };
  }
};

export const addRating = async (bookId, userId, star, review) => {
  try {
    if (!bookId || !userId || star === undefined) {
      alert("you need to at least rate the book");
    }

    // API endpoint
    const apiUrl = `${API_BASE_URL}/api/v1/user/book/rate`; // Replace with your actual API URL

    // Make the API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, userId, star, review }),
    });

    // Parse the response
    const result = await response.json();

    // Check for API errors
    if (!response.ok) {
      throw new Error(result.error || "Failed to add or update rating.");
    }

    // Return the result
    return result;
  } catch (error) {
    // Handle and log errors
    console.error("Error in addOrUpdateRating:", error.message);
    return { success: false, error: error.message };
  }
};

export const details = async (bookId, userId) => {
  const url = `${API_BASE_URL}/api/v1/user/book/details`; // Replace with your actual API URL

  try {
    // Make a POST request to the API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, userId }), // Send bookId in the request body
    });

    // Parse the response
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch book details");
    }

    return result.book; // Return the book details
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    throw error; // Re-throw the error for further handling
  }
};

export const fetchBooks = async (sort = null, search = null) => {
  try {
    const requestBody = {};

    if (sort) requestBody.sort = sort;
    if (search) requestBody.search = search;
    const response = await fetch(`${API_BASE_URL}/api/v1/user/book/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Send only available parameters
    });

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const data = await response.json();
    if (data.success) {
      return data.books;
    } else {
      throw new Error(data.error || "Something went wrong");
    }
  } catch (error) {
    console.error("Error fetching books:", error.message);
    throw error; // Re-throw the error for the calling function to handle
  }
};

export const getWishlist = async (userId, search = "") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/book/get_wishlist?userId=${userId}&search=${search}`
    );
    const result = await response.json();

    // Handle response or error
    if (response.ok) {
      return result.data; // Return the wishlist data
    } else {
      console.error("Error fetching wishlist:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Error in getWishlist function:", error);
    return null;
  }
};
