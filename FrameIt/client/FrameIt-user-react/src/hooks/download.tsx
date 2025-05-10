import axios from 'axios';

const downloadFile = async (fileId: string, fileName: string) => {
  try {
    console.log(fileName);
    const response = await axios.get(`http://localhost:5282/files/${fileId?? '0'}/downloadToComputer`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
      
    });

    // טיפול בשם הקובץ מה-Headers
    // const contentDisposition = response.headers['content-disposition'];
    // let filename = 'downloaded-file';

    // if (contentDisposition) {
    //   const filenameRegex = /filename\*=UTF-8''(.+)|filename=(["']?)(.+?)\2/;
    //   const match = contentDisposition.match(filenameRegex);
    //   if (match) {
    //     filename = decodeURIComponent(match[1] || match[3]);
    //   }
    

    // יצירת URL להורדת הקובץ
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // ניקוי המשאבים
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: unknown) { // Added explicit type for error
    console.error('Error downloading file:', error);
  }
};

const downloadByUrl = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  link.setAttribute('target', '_blank'); // אופציונלי, אם רוצים לפתוח בחלון חדש
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



 const downloadFolder = async (folderId: string, folderName: string) => {
  try {
    const response = await fetch(`http://localhost:5282/folders/${folderId}/download`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();

    // יצירת לינק זמני להורדה
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${folderName}.zip`; // שם הקובץ שיהיה בשמירה
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading folder:", error);
    alert("התרחשה שגיאה בהורדת התיקייה");
  }
};
export { downloadFile, downloadFolder, downloadByUrl };
