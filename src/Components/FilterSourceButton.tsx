// src/components/FilterSourceButton.tsx
import React from 'react';
import { Popover, UnstyledButton } from '@mantine/core';
import { IconRadar } from '@tabler/icons-react';
import { SearchableMultiSelect } from './SearchableMultiSelect';


interface FilterSourceButtonProps {
  sources: string[];
  selectedSources: string[];
  onFilterChange: (selectedSources: string[]) => void; // Callback for filter changes
}

const FilterSourceButton: React.FC<FilterSourceButtonProps> = ({ sources,selectedSources, onFilterChange }) => {


  return (
    <Popover width={250} position="right" withArrow shadow="md">
      <Popover.Target>
        <UnstyledButton style={{ display: 'flex', alignItems: 'center' }}>
          <IconRadar size={20} stroke={1.5} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown >
        <SearchableMultiSelect sources={sources} value={selectedSources} onChange={onFilterChange} />
      </Popover.Dropdown>
    </Popover>
  );
};

export default FilterSourceButton;
