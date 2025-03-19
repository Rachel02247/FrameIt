// Gallery.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, ImageList, ImageListItem } from '@mui/material';
import axios from 'axios';
import FolderItem from './FolderItem';
import FileItem from './fileItem';
import Search from './search';
import LoadingIndicator from './loadingIndicator';
import { Folder, File } from '../../types';


const API_BASE_URL = 'http://localhost:5282';

export default function Gallery() {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (folderId: string | null = '0') => {
    setLoading(true);
    try {
      const url = folderId
        ? `${API_BASE_URL}/folders/${folderId}/contents`
        : `${API_BASE_URL}/folders/0/contents`;
      const { data } = await axios.get(url);
      setFolders(data.folders);
      setFiles(data.files);
      const breadcrumbRes = await axios.get(folderId ? `${API_BASE_URL}/folders/${folderId}/breadcrumb` : `${API_BASE_URL}/folders/0/breadcrumb`);
      setBreadcrumb(breadcrumbRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const deleteFileOrFolder = async (id: string, type: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${type}/${id}`);
      fetchData(currentFolder);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  useEffect(() => {
    fetchData(currentFolder);
  }, [currentFolder]);

  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f4f4', minHeight: '100vh', width: 1000, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', mt: 4, ml: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        My Gallery
      </Typography>
      <Search searchTerm={searchTerm} onSearch={handleSearch} />
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ marginBottom: 3 }}>
        <Link color={currentFolder === null ? 'textPrimary' : 'inherit'} onClick={() => setCurrentFolder(null)}>
          Gallery
        </Link>
        {breadcrumb.map((folder) => (
          <Link key={folder.id} onClick={() => setCurrentFolder(folder.id)}>
            {folder.name}
          </Link>
        ))}
      </Breadcrumbs>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <ImageList variant="masonry" cols={3} gap={16}>
          {filteredFolders.map((folder) => (
            <ImageListItem key={folder.id}>
              <FolderItem
                folder={folder}
                onClick={() => setCurrentFolder(folder.id)}
                onDelete={() => deleteFileOrFolder(folder.id, 'folders')}
              />
            </ImageListItem>
          ))}
          {filteredFiles.map((file) => (
            <ImageListItem key={file.id}>
              <FileItem file={file} onDelete={() => deleteFileOrFolder(file.id, 'files')} />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}
