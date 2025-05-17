import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../component/global-states/store";
import { getFileDownloadUrl } from "../component/global-states/fileSlice";

interface ImagePreviewModalProps {
  file: {
    fileType: string;
    fileName: string;
    s3Key: string;
    id: string;
  };
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  file,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  const isVideo = file.fileType.toLowerCase() === "mp4" || file.fileType.toLowerCase() === "mov";
  const dispatch = useDispatch<AppDispatch>();
  const files = useSelector((state: RootState) => state.files.files);

  const currentFile = files.find((f) => f.id === file.id);
  const [fileUrl, setFileUrl] = useState(currentFile?.downloadUrl);

  useEffect(() => {
    if (currentFile && !currentFile.downloadUrl && currentFile.s3Key) {
      dispatch(getFileDownloadUrl(currentFile.s3Key))
        .unwrap()
        .then((url) => {
          setFileUrl(url);
        })
        .catch(() => {
          setFileUrl(undefined);
        });
    }
  }, [currentFile, dispatch]);

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      >
        {hasPrev && (
          <IconButton sx={{ position: "absolute", left: 16, color: "#fff" }} onClick={onPrev}>
            <ArrowBackIosIcon />
          </IconButton>
        )}

        {isVideo ? (
          <video controls src={fileUrl ?? '/img/frameItLogo.png'} style={{ maxHeight: "80vh" }} />
        ) : (
          <img src={fileUrl ?? '/img/frameItLogo.png'} alt={file.fileName} style={{ maxHeight: "80vh" }} />
        )}

        {hasNext && (
          <IconButton sx={{ position: "absolute", right: 16, color: "#fff" }} onClick={onNext}>
            <ArrowForwardIosIcon />
          </IconButton>
        )}

        <IconButton sx={{ position: "absolute", top: 16, right: 16, color: "#fff" }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ImagePreviewModal;
