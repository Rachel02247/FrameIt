import axios from "axios";

const API_URL_BASE = `${import.meta.env.VITE_API_URL}/files`;



export const uploadFiles = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL_BASE}`, formData, {
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



export const getFileDownloadUrl = async (fileId: string) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/download/${fileId}`);
    return response.data.url; // Assuming the API returns a `url` field
  } catch (error) {
    console.error("Error fetching file download URL:", error);
    throw error;
  }
};

export const fetchFilesByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/myfiles/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching files by user ID:", error);
    throw error;
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    const response = await axios.delete(`${API_URL_BASE}/${fileId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};