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

export const fetchDataByUserIdAndFolderId = async (folderId: number, userId: number) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/${folderId}/contents/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching files by user ID and folder ID:", error);
    throw error;
  }
};

export const createFolder = async (folderData: { name: string; ownerId: number; isDeleted: boolean, parentFolderId: number }) => {
  try {
    const response = await axios.post(API_URL_BASE, folderData, {
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

export const fetchFoldersByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/myFiles/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching files by user ID:", error);
    throw error;
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    const response = await axios.delete(`${API_URL_BASE}/${folderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};