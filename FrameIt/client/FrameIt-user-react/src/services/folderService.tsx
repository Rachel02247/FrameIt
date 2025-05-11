const API_URL_BASE =  `${import.meta.env.VITE_API_URL}/folders`


export const fetchFolderByCurrentFolder = async((folderId: number, userId: number) => {

        await axios.get(`${API_URL_BASE}/${folderId}/contents/${userId || 0}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Error fetching folder contents:", error);
            throw error;
        });
    });

export const fetchFoldersBreadcrumbs = async((folderId) =>
    {
     await axios.get(`${API_URL_BASE}/${folderId}/breadcrumb`)
     .then((response) => {
        return response.data;
        })
        .catch((error) => {
            console.error("Error fetching folder breadcrumbs:", error);
            throw error;
        });
    });


export const fetchFilesByUserIdAndFolderId = async((folderId: number, userId: number) => {
    await axios.get(`${API_URL_BASE}/${folderId}/contents/${userId}`)
    .then((response) => {
        return response.data;
    })  
    .catch((error) => {
        console.error("Error fetching files by user ID and folder ID:", error);
        throw error;
    });
});