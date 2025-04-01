import React from "react";
import { Container, Typography } from "@mui/material";
import axios from "axios";
import FileUpload from "./fileUpload";
// import { MyFile } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../global-states/store";

const Upload = () => {
  
  const url = "http://localhost:5282/files"; // נתיב ה-API להעלאת קבצים
  const user = useSelector((state: RootState) => state.user.user); // או לפי האיד של המשתמש הנוכחי אם יש לך

  const handleUpload = async (selectedFiles: FileList, _folderId: string) => {
    const formData = new FormData();

    const files: FileList = selectedFiles;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(file);
        formData.append("file", file); // הוספת הקובץ לפורמט הנכון

        // הוספת מטא-דאטה עם פרטי הקובץ
        formData.append("FileName", file.name);
        formData.append("FileType", file.type);
        formData.append("FolderId", _folderId);
        formData.append("Size", file.size);
        formData.append("S3Key", `${_folderId}/${file.name}`);
        formData.append("IsDeleted", "false");
        formData.append("OwnerId", user?.id ?? '0');
        console.log(formData)

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("File uploaded successfully:", response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error uploading file:", error.response?.data || error.message);
            } else {
                console.error("Unknown error:", error);
            }
        }
    }
}


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Upload Files to FrameIt
      </Typography>
      <FileUpload onUpload={handleUpload} />
    </Container>
  );
};

export default Upload;
