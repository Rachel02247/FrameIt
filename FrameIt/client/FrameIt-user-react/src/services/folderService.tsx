import axios from "axios";

const API_URL_BASE = `${import.meta.env.VITE_API_URL}/folders`;

export const fetchFolderByCurrentFolder = async (folderId: string, userId: number) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/${+folderId}/contents/${userId || 0}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching folder contents:", error);
    throw error;
  }
};

export const fetchFoldersBreadcrumbs = async (folderId: string) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/${+folderId}/breadcrumb`);
    return response.data;
  } catch (error) {
    console.error("Error fetching folder breadcrumbs:", error);
    throw error;
  }
};

export const fetchFilesByUserIdAndFolderId = async (folderId: number, userId: number) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/${folderId}/contents/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching files by user ID and folder ID:", error);
    throw error;
  }
};