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

  const userId = sessionStorage.getItem("id");

  const handleUpload = async (files: MyFile[], folderId: string) => {
    try {
      console.log(userId)

      console.log("user?.id")
      console.log(user?.id)
      for (const file of files) {
        if (file.file) {
          const formData = new FormData();
          formData.append("file", file.file);

          const metadata = {
            id: file.id,
            fileName: file.fileName,
            fileType: file.fileType,
            size: file.size,
            s3Key: file.s3Key,
            isDeleted: file.isDeleted,
            folderId: file.folderId,
            ownerId: parseInt(user?.id ?? userId ?? "0")
          };

          console.log("ownerid", metadata.ownerId)
          formData.append("fileMetadata", JSON.stringify(metadata));
          formData.append("folderId", folderId);

          console.log("Uploading file:", file.fileName);
          for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
          }

          await dispatch(uploadFiles(formData)).unwrap();
          console.log(`File ${file.fileName} uploaded successfully`);
        }
      }
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
