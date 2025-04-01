import React, { useEffect, useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, ImageList, ImageListItem } from '@mui/material';
import axios from 'axios';
import FolderItem from './folderItem';
import FileItem from './fileItem';
import Search from './search';
import LoadingIndicator from '../../hooks/loadingIndicator';
import { Folder, MyFile } from '../../types';
import CreateFolder from '../../hooks/createFolder';
import FolderMenu from '../../hooks/folderMenu';
import { RootState } from '../../global-states/store';
import { useSelector } from 'react-redux';
import ImagePreviewModal from '../../hooks/imagePreviewModal';

const API_BASE_URL = 'http://localhost:5282';

export default function Gallery() {
  const [files, setFiles] = useState<MyFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>('0');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const images = ["img/nb/1.jpg", "img/nb/2.jpg", "img/nb/3.jpg", "img/nb/4.jpg"];

  const fetchData = async (folderId: string | null = '0') => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/folders/${folderId}/contents/${userId}`;
      const { data } = await axios.get(url);
      setFolders(data.folders);
      setFiles(data.files);
      const breadcrumbRes = await axios.get(`${API_BASE_URL}/folders/${folderId}/breadcrumb`);
      setBreadcrumb(breadcrumbRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(currentFolder);
  }, [currentFolder]);

  const handleOpenPreview = (fileId: string) => {
    const index = files.findIndex((file) => file.id === fileId);
    if (index !== -1) {
      setSelectedFileIndex(index);
    }
  };

  const handleClosePreview = () => {
    setSelectedFileIndex(null);
  };

  const handleNext = () => {
    setSelectedFileIndex((prevIndex) =>
      prevIndex !== null && prevIndex < files.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrev = () => {
    setSelectedFileIndex((prevIndex) =>
      prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <Box sx={{
      position: 'relative', padding: 4, backgroundColor: '#ffff', minHeight: '100vh',
      width: 1000, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', mt: 4, ml: 'auto', mr: 'auto',
    }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        My Gallery
      </Typography>

      <Search searchTerm={searchTerm} onSearch={setSearchTerm} />

      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ marginBottom: 3 }}>
        <Link color={currentFolder === '0' ? 'textPrimary' : 'inherit'} onClick={() => setCurrentFolder('0')}>
          Gallery
        </Link>
        {breadcrumb.map((folder) => (
          <Link key={folder.id} onClick={() => setCurrentFolder(folder.id)}>
            {folder.name}
          </Link>
        ))}
      </Breadcrumbs>

      <CreateFolder folderId={currentFolder ?? '0'} fetchData={fetchData} />
      <FolderMenu />

      {loading ? (
        <LoadingIndicator />
      ) : (
        <ImageList variant="masonry" cols={4} gap={16}>
          {folders.map((folder) => (
            <ImageListItem key={folder.id} component="div">
              <FolderItem folder={folder} onClick={() => setCurrentFolder(folder.id)} onDelete={function (): void {
                throw new Error('Function not implemented.');
              }} />
            </ImageListItem>
          ))}
          {files.map((file) => (
            <ImageListItem key={file.id} component="div">
              <FileItem file={file} onDelete={() => fetchData(currentFolder)} onOpenPreview={handleOpenPreview} />
            </ImageListItem>
          ))}

        </ImageList>
      )}

      {/* מודל לתצוגת תמונה מוגדלת */}
      {selectedFileIndex !== null && (
        <ImagePreviewModal
          file={files[selectedFileIndex]}
          onClose={handleClosePreview}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedFileIndex < files.length - 1}
          hasPrev={selectedFileIndex > 0}
        />
      )}
    </Box>
  );
}
