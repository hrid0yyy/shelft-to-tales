// messengerApi.js
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/v1/user/messenger`;

// Function to send a message
export const deliverMessage = async (senderId, receiverId, message) => {
  try {
    const response = await fetch(`${API_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId, receiverId, message }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const data = await response.json();
    return data.success; // Assuming the response has a success key
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Function to fetch messages between sender and receiver
export const fetchMessages = async (senderId, receiverId) => {
  try {
    const response = await fetch(
      `${API_URL}/fetch?senderId=${senderId}&receiverId=${receiverId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    return { messages: data.messages, receiverInfo: data.receiverInfo };
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Function to delete a message by id
export const deleteMessage = async (id) => {
  try {
    const response = await fetch(`${API_URL}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete message");
    }

    const data = await response.json();
    return data.success; // Assuming the response has a success key
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Function to fetch new messages with id greater than provided id
export const fetchNewMessages = async (senderId, receiverId, id, isSeen) => {
  try {
    const response = await fetch(
      `${API_URL}/new?senderId=${senderId}&receiverId=${receiverId}&id=${id}&isSeen=${isSeen}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch new messages");
    }

    const data = await response.json();
    return data.messages; // Assuming the response has a messages key
  } catch (error) {
    console.error("Error fetching new messages:", error);
    throw error;
  }
};

// Function to fetch the inbox (all messages involving the user)
export const fetchInbox = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/inbox?userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch inbox");
    }

    const data = await response.json();
    return data.messages; // Assuming the response has a messages key
  } catch (error) {
    console.error("Error fetching inbox:", error);
    throw error;
  }
};
