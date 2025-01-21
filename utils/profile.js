// profileApi.js (Client-side API call functions)
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/v1/user/profile`;

// Function to update user details
export async function updateUser(id, updates) {
  try {
    const response = await fetch(`${API_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, updates }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("User updated successfully:", result.user);
    } else {
      console.error("Error updating user:", result.error);
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
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
export async function toggleFollow(follower, following) {
  try {
    const response = await fetch(`${API_URL}/toggle-follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ follower, following }),
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
