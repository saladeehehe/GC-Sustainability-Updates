// src/components/FilterSourceButton.tsx
import React from 'react';
import { Popover, UnstyledButton } from '@mantine/core';
import { IconRadar } from '@tabler/icons-react';
import { SearchableMultiSelect } from './SearchableMultiSelect';

interface FilterSourceButtonProps {
  sources: string[];
  onFilterChange: (selectedSources: string[]) => void; // Callback for filter changes
}

const FilterSourceButton: React.FC<FilterSourceButtonProps> = ({ sources, onFilterChange }) => {
  const handleFilterChange = (selectedSources: string[]) => {
    onFilterChange(selectedSources); // Call the callback when filters change
  };

  return (
    <Popover width={300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <UnstyledButton style={{ display: 'flex', alignItems: 'center' }}>
          <IconRadar size={20} stroke={1.5} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <SearchableMultiSelect sources={sources} onChange={handleFilterChange} />
      </Popover.Dropdown>
    </Popover>
  );
};

export default FilterSourceButton;
