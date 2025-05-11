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

export const createFolder = async (folderData: { name: string; ownerId: number; isDeleted: boolean }) => {
  try {
    const response = await axios.post(`${API_URL_BASE}/folders`, folderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating folder:", error);
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