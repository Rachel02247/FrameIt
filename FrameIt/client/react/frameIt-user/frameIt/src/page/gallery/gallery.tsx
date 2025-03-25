import React, { useEffect, useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, ImageList, ImageListItem } from '@mui/material';
import axios from 'axios';
import FolderItem from './folderItem';
import FileItem from './fileItem';
import Search from './search';
import LoadingIndicator from './loadingIndicator';
import { Folder, MyFile } from '../../types';
import CreateFolder from '../../hooks/createFolder';
import FolderMenu from '../../hooks/folderMenu';

const API_BASE_URL = 'http://localhost:5282';

export default function Gallery() {
  const [files, setFiles] = useState<MyFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ id: string; name: string }[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>('0');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (folderId: string | null = '0') => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/folders/${folderId}/contents`;
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
  const filteredFiles = files.filter((file) => file.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ position: 'relative', padding: 4, backgroundColor: '#f4f4f4', minHeight: '100vh',
     width: 1000, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', mt: 4, ml: 'auto', mr: 'auto',
    }}
     >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        My Gallery
      </Typography>
      
      <Search searchTerm={searchTerm} onSearch={handleSearch} />

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

      <CreateFolder folderId={currentFolder ?? '0'} />
<FolderMenu/>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <ImageList variant="masonry" cols={4} gap={16}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
          justifyContent: 'start',
          }}>
          {filteredFolders.map((folder) => (
            <ImageListItem key={folder.id} component="div">
              <FolderItem folder={folder} onClick={() => setCurrentFolder(folder.id)} onDelete={() => deleteFileOrFolder(folder.id, 'folders')} />
            </ImageListItem>
          ))}

          {filteredFiles.map((file) => (
            <ImageListItem key={file.id} component="div">
              <FileItem file={file} onDelete={() => deleteFileOrFolder(file.id, 'files')} />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}
