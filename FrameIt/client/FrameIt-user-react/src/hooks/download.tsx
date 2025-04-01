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
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

export { downloadFile };
