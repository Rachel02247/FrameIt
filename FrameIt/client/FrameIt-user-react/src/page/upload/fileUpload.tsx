import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    Typography,
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    IconButton,
    Box
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { Folder, MyFile } from "../../types";
import axios from "axios";
import CreateFolder from "../../hooks/createFolder";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { RootState } from "../../global-states/store";
import LoadingIndicator from "../../hooks/loadingIndicator";

interface FileUploadProps {
    onUpload: (files: MyFile[], folderId: string) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFolder, setSelectedFolder] = useState("");
    const [folders, setFolders] = useState<Folder[]>([]);
    const [subFolders, setSubFolders] = useState<Folder[]>([]);
    const url = "http://localhost:5282/";
    const userId = useSelector((state: RootState) => state.user.user?.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${url}folders/myFiles/${userId}`);
                setFolders(res.data);
            } catch (error) {
                console.error("Error fetching folders:", error);
            }
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        const fetchSubFolders = async () => {
            if (!selectedFolder) return;

            try {
                const res = await axios.get(`${url}folders/${selectedFolder}/contents/${userId}`);
                setSubFolders(res.data.folders);  // Store subfolders here
            } catch (error) {
                console.error("Error fetching subfolders:", error);
            }
        };

        fetchSubFolders();
    }, [selectedFolder, userId]);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*,video/*",
        multiple: true
    });

    const handleUpload = async () => {
        if (!files.length || !selectedFolder) {
            console.warn("❌ No files selected or folder not chosen!");
            return;
        }
        setLoading(true);
        setUploadProgress(0);

        try {
            await onUpload(files, selectedFolder);
            console.log("✅ Upload successful!");
            setFiles([]);
        } catch (error) {
            console.error("❌ Upload failed", error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={() => setOpen(true)}
            >
                Upload
            </Button>

            <Box>
                <Dialog open={open} onClose={() => setOpen(false)} fullWidth  >
                    <DialogTitle>Upload to FrameIt!</DialogTitle>
                    <DialogContent>
                        {!files.length && (
                            <div {...getRootProps()} style={{
                                height: '50%',
                                border: "2px dashed #ccc",
                                padding: 20,
                                textAlign: "center",
                                cursor: "pointer",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "0.3s",
                                boxShadow: isDragActive ? "0 0 15px rgba(255,255,255,0.5)" : "0 4px 8px rgba(0,0,0,0.2)"
                            }}>
                                <input {...getInputProps()} />
                                <CloudUploadIcon fontSize="large" sx={{ mr: 1 }} />
                                <Typography variant="body1">{isDragActive ? "Drop files here..." : "Drag & drop files here, or click to select files"}</Typography>
                            </div>
                        )}

                        {files.length > 0 && (
                            <>
                                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                    Selected items:
                                </Typography>
                                <List>
                                    {files.map((file, index) => (
                                        <ListItem key={index}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                                                    <CancelIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={file.name}
                                                secondary={`Size: ${(file.size / 1024).toFixed(2)} KB`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}

                        <Typography variant="h6" color="primary" sx={{ mt: 4 }}>
                            Upload to existing folder or create new
                        </Typography>

                        {/* Select Folders from Root (ID 0) */}
                        <Select
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {folders.map((folder) => (
                                <MenuItem key={folder.id} value={folder.id}>
                                    {folder.name}
                                </MenuItem>
                            ))}
                        </Select>

                        {/* Display Subfolders if any */}
                        {subFolders.length > 0 && (
                            <>
                                <Typography variant="h6" color="primary" sx={{ mt: 4 }}>
                                    Subfolders:
                                </Typography>
                                <Select
                                    value={selectedFolder}
                                    onChange={(e) => setSelectedFolder(e.target.value)}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    {subFolders.map((folder) => (
                                        <MenuItem key={folder.id} value={folder.id}>
                                            {"-- " + folder.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </>
                        )}

                        <CreateFolder />

                        {loading && (
                            <>
                                <Typography sx={{ mt: 2 }}>Uploading... {uploadProgress}%</Typography>
                                <LinearProgress variant="determinate" value={uploadProgress} />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} color="primary" disabled={loading}>
                           {loading? <img src="img/spinner.gif" alt="spinnre" width={24} /> : 'Upload' } 
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default FileUpload;
