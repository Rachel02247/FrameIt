import React from "react";
import { Container, Typography } from "@mui/material";
import FileUpload from "./fileUpload";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../component/global-states/store";
import { MyFile } from "../../types";
import { uploadFiles } from "../../component/global-states/fileSlice";

const Upload = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleUpload = async (files: MyFile[], folderId: string) => {
    const formattedFiles = files.map((file) => ({
      ...file,
      isDeleted: false,
      ownerId: user?.id ?? "0",
    }));

    try {
      const formData = new FormData();
      formattedFiles.forEach((file) => {
        if (file.file) {
          formData.append("files", file.file);
        }
        formData.append("fileMetadata", JSON.stringify({
          s3Key: file.s3Key,
          isDeleted: file.isDeleted,
          ownerId: file.ownerId,
        }));
      });
      formData.append("folderId", folderId);

      await dispatch(uploadFiles(formData)).unwrap();
      console.log("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
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
