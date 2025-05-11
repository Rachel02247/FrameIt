const API_URL_BASE =  `${import.meta.env.VITE_API_URL}/files`

export const fetchFilesByUserId = async((userId: number) =>{

    await axios.get(`${API_URL_BASE}/myFiles/${userId}`)
    .then((response) => {
        return response.data;
    })  
    .catch((error) => {
        console.error("Error fetching files by user ID:", error);
        throw error;
    });
})

export const uploadFiles = async((formData) => { 
        axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Error uploading files:", error);
            throw error;
        });
    });