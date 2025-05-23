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
  try {
    const formData = new FormData();

    files.forEach((file) => {
      if (file.file) {
        formData.append("files", file.file);
      }
    });

    const metadataArray = files.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      size: file.size,
      s3Key: file.s3Key,
      isDeleted: file.isDeleted,
      folderId: file.folderId,
      ownerId: file.ownerId,
    }));

    formData.append("fileMetadata", JSON.stringify(metadataArray));

    formData.append("folderId", folderId);

    console.log("Uploading files...");
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
