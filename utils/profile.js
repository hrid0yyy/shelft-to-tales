// profileApi.js (Client-side API call functions)
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/v1/user/profile`;

export async function updateProfile(id, updateFields) {
  try {
    // Ensure the ID and fields are provided
    if (!id) {
      throw new Error("User ID is required");
    }
    console.log(updateFields);
    // Make the API request
    const response = await fetch(`${API_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...updateFields }),
    });

    // Parse the response
    const result = await response.json();

    // Handle errors
    if (!response.ok) {
      throw new Error(result.error || "Failed to update user");
    }

    // Return the result
    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Error updating user:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to get a user profile
export async function getUserProfile(ownId, userId) {
  try {
    const response = await fetch(
      `${API_URL}/get_user?userId=${userId}&ownId=${ownId}`
    );
    const result = await response.json();

    if (response.ok) {
      return result.data;
    } else {
      console.error("Error fetching user:", result.error);
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error);
  }
}

// Function to toggle follow status
export async function toggleFollow(follower, following, username) {
  try {
    const response = await fetch(`${API_URL}/toggle-follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ follower, following, username }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(result.message);
    } else {
      console.error("Error toggling follow status:", result.error);
    }
  } catch (error) {
    console.error("Error in toggleFollow:", error);
  }
}

// Usage examples:
// updateUser('user-123', { username: 'JohnDoe' });
// getUserProfile('user-123');
// toggleFollow('user-123', 'user-456');
