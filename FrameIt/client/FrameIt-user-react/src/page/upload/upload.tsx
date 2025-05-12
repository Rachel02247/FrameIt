import React from "react";
import { Container, Typography } from "@mui/material";
import axios from "axios";
import FileUpload from "./fileUpload";
import { useSelector } from "react-redux";
import { RootState } from "../../component/global-states/store";
import { MyFile } from "../../types";
import { uploadFiles } from "../../services/filesService";

const Upload = () => {
  
  console.log("in upload");
  console.log("in upload");
  
  const user = useSelector((state: RootState) => state.user.user);

  const handleUpload = async (files: MyFile[], folderId: string) => {
    console.log("Uploading files:", files);
    console.log("Folder ID:", folderId);
    
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {

      const file = files[i];
      formData.append("file", file.file ?? new Blob());
      formData.append("FileName", file.fileName);
      formData.append("FileType", file.fileType);
      formData.append("FolderId", folderId);
      formData.append("Size", file.size.toString());
      formData.append("S3Key", `${folderId}/${file.fileName}`);
      formData.append("IsDeleted", "false");
      formData.append("OwnerId", user?.id ?? "0");

      try {
        console.log("Uploading file:", file.fileName);

        const response = await uploadFiles(formData);
        console.log("after upload", response);
        
        console.log("File uploaded successfully:", response);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error uploading file:", error.response?.data || error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Upload Files to FrameIt
      </Typography>
      <FileUpload
        onUpload={(selectedFiles, folderId) => {
          const myFiles: MyFile[] = Array.from(selectedFiles).map((curFile) => ({
            file: curFile.file,
            id: crypto.randomUUID(),
            fileName: curFile.fileName,
            fileType: curFile.fileType,
            size: curFile.size,
            s3Key: "",
            isDeleted: false,
            folderId: folderId,
            ownerId: user?.id ?? "0",
          
          }));
          return handleUpload(myFiles, folderId);
        }}
      />
    </Container>
  );
};

export default Upload;
