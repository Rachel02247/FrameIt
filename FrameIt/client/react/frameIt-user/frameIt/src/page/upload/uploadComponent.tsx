import { useState } from "react";
import { Button, CircularProgress, MenuItem, Select, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface UploadComponentProps {
    folders: string[]; // רשימת תיקיות קיימות
    onUpload: (file: File, folder: string) => Promise<void>;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ folders, onUpload }) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [selectedFolder, setSelectedFolder] = useState(folders[0] || "");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !selectedFolder) return;
        setLoading(true);
        try {
            await onUpload(file, selectedFolder);
        } catch (error) {
            console.error("Upload failed", error);
        }
        setLoading(false);
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={() => setOpen(true)}
            >
                upload
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>upload to FrameIt!</DialogTitle>
                <DialogContent>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <Select
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {folders.map((folder) => (
                            <MenuItem key={folder} value={folder}>
                                {folder}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">cancel</Button>
                    <Button onClick={handleUpload} color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "upload"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UploadComponent;
