import React from 'react';

import { Popover, UnstyledButton } from '@mantine/core';
import { IconRadar } from '@tabler/icons-react';
import { SearchableMultiSelect } from './SearchableMultiSelect';


interface CategoryFilterProps {
  categories: string[];
  onCategoryChange: (selectedCategories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onCategoryChange }) => {
    const handleCategoryChange = (selectedCategories: string[]) => {
        onCategoryChange(selectedCategories); // Call the callback when filters change
      };
    return (
    <Popover width={300} position="right" withArrow shadow="md">
        <Popover.Target>
        <UnstyledButton style={{ display: 'flex', alignItems: 'center' }}>
            <IconRadar size={20} stroke={1.5} />
        </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown >
        <SearchableMultiSelect sources={categories} onChange={handleCategoryChange} />
        </Popover.Dropdown>
    </Popover>
    );
};

export default CategoryFilter;
