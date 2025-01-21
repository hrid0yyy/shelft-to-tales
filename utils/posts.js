// postApi.js (Client-side API call functions)
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/v1/user/post`;

// Create a new post
export async function createPost(userId, content) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, content }),
    });

    const result = await response.json();

    if (response.ok) {
      return true;
    } else {
      return false;
      console.error("Error creating post:", result.error);
    }
  } catch (error) {
    console.error("Error in createPost:", error);
  }
}

// Delete a post by ID
export async function deletePost(postId) {
  try {
    const response = await fetch(`${API_URL}/post?id=${postId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Post deleted successfully:", result.message);
    } else {
      console.error("Error deleting post:", result.error);
    }
  } catch (error) {
    console.error("Error in deletePost:", error);
  }
}

// Fetch user's own posts
export async function fetchOwnPosts(userId) {
  try {
    const response = await fetch(`${API_URL}/fetch-own?userId=${userId}`);
    const result = await response.json();

    if (response.ok) {
      console.log("Fetched user's posts:", result.data);
    } else {
      console.error("Error fetching user's posts:", result.error);
    }
  } catch (error) {
    console.error("Error in fetchOwnPosts:", error);
  }
}

// Fetch all posts
export async function fetchAllPosts() {
  try {
    const response = await fetch(`${API_URL}/all`);
    const result = await response.json();

    if (response.ok) {
      return result.data;
    } else {
      console.error("Error fetching posts:", result.error);
    }
  } catch (error) {
    console.error("Error in fetchAllPosts:", error);
  }
}

// Fetch posts from users being followed
export async function fetchFollowingPosts(followerId) {
  try {
    const response = await fetch(`${API_URL}/following?follower=${followerId}`);
    const result = await response.json();

    if (response.ok) {
      return result.data;
    } else {
      console.error("Error fetching followed users' posts:", result.error);
    }
  } catch (error) {
    console.error("Error in fetchFollowingPosts:", error);
  }
}

// Usage examples:
// createPost('user-123', 'This is my new post!');
// deletePost('post-456');
// fetchOwnPosts('user-123');
// fetchAllPosts();
// fetchFollowingPosts('user-123');
