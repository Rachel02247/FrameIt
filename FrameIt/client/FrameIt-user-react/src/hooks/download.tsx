import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_BASE = `${API_URL}/files`;

const downloadFile = async (fileId: string, fileName: string) => {
  try {
    console.log(fileName);
    const response = await axios.get(`${API_URL_BASE}/${fileId?? '0'}/downloadToComputer`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
      
    });

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: unknown) { 
    console.error('Error downloading file:', error);
  }
};

const downloadByUrl = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  link.setAttribute('target', '_blank'); 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



 const downloadFolder = async (folderId: string, folderName: string) => {
  try {
    const response = await fetch(`${API_URL}/folders/${folderId}/download`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${folderName}.zip`; 
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading folder:", error);
    alert("Failed to download folder");
  }
};
export { downloadFile, downloadFolder, downloadByUrl };
