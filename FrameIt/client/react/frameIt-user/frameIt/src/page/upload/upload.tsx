import UploadComponent from "./uploadComponent";
import { Container, Typography } from "@mui/material";

const folders = ["images", "profile-pics", "documents", "videos", "archives"];

const handleUpload = async (files: File[], folder: string) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("folder", folder);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    console.log("Files uploaded successfully");
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};

const Upload = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Upload Files to FrameIt
      </Typography>
      <UploadComponent folders={folders} onUpload={handleUpload} multiple />
    </Container>
  );
};

export default Upload;
