import axios from "axios";

const API_URL_BASE = `${import.meta.env.VITE_API_URL}/files`;



export const uploadFiles = async (formData: FormData) => {
  try {
    console.log("in upload files service", formData);

    
    const response = await axios.post(`${API_URL_BASE}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response from upload files", response);
    
    
    return response.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};



export const getFileDownloadUrl = async (s3Key: string) => {
    console.log("in getFileDownloadUrl", s3Key);
    
  try {
    console.log("in getFileDownloadUrl before server", s3Key);
    
    const response = await axios.get(`${API_URL_BASE}/${s3Key}/download`);
    console.log("res after server", response.data);
    
    return response.data; 
  } catch (error) {
    console.error("Error fetching file download URL:", error);
    throw error;
  }
};

export const fetchFilesByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL_BASE}/myfiles/${userId}`);
    const files = response.data;

    // Fetch download URLs for all files
    const filesWithUrls = await Promise.all(
      files.map(async (file: { id: string; s3Key: string }) => {
        try {
          const downloadUrl = await getFileDownloadUrl(file.s3Key);
          return { ...file, downloadUrl }; // Add the download URL to the file object
        } catch (error) {
          console.error(`Error fetching download URL for file ${file.id}:`, error);
          return { ...file, downloadUrl: null }; // Handle errors gracefully
        }
      })
    );

    return filesWithUrls;
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