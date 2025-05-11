import axios from "axios";

const API_URL_BASE = `${import.meta.env.VITE_API_URL}/files`;

export const fetchFilesByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/myFiles/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching files by user ID:", error);
    throw error;
  }
};

export const uploadFiles = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL_BASE}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};