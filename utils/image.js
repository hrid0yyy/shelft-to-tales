import { API_BASE_URL } from "../config";

// Function to call the backend API to search for books
export const searchBooksFromImage = async (imageUri) => {
  try {
    // Extract file name from the URI
    const fileName = imageUri.split("/").pop();

    // Create form data
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: fileName,
      type: "image/jpeg", // Change this if using another image format like PNG
    });

    // Define your server endpoint
    const endpoint = `${API_BASE_URL}/api/v1/utils/image/search`; // Replace with your actual server URL

    // Make the POST request
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      console.error("Search failed:", result.error);
    }
  } catch (error) {
    console.error("Error during API call:", error.message);
  }
};

export const uploadImageToServer = async (imageUri) => {
  try {
    // Extract file name from the URI
    const fileName = imageUri.split("/").pop();

    // Create form data
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: fileName,
      type: "image/jpeg", // Change this if using another image format like PNG
    });

    // Define your server endpoint
    const endpoint = `${API_BASE_URL}/api/v1/utils/image/upload`; // Replace with your actual server URL

    // Make the POST request
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = await response.json();

    if (response.ok) {
      return result.publicUrl;
    } else {
      console.error("Upload failed:", result.error);
    }
  } catch (error) {
    console.error("Error during upload:", error.message);
  }
};
