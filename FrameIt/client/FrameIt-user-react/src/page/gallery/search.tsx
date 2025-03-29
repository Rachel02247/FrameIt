// Search.tsx
import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchProps {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}

// eslint-disable-next-line react-hooks/rules-of-hooks
// const [query, setQuery] = useState('');

export const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

 const Search: React.FC<SearchProps> = ({ searchTerm, onSearch }) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    onSearch(query);
  };

  return (
    <TextField
      variant="outlined"
      fullWidth
      placeholder="Search files and directories..."
      value={searchTerm}
      onChange={handleSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        m: 2
      }}
    />
  );
};

export default Search;
