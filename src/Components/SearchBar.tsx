import React from 'react';
import { Input } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <Input
      placeholder="Search..." 
      leftSection= {<IconSearch />}
      value={searchTerm}
      onChange={onSearchChange}
      style={{ marginBottom: '10px', width: '100%' }} // Adjust styles as needed
    />
  );
};

export default SearchBar;