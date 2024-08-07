import { useState } from 'react';

import { Center, Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
  IconHome2,
  IconRadar,
  IconCalendar,
  IconBookmark,
  IconCategory,
} from '@tabler/icons-react';
import classes from './NavbarMinimal.module.css';
import FilterSourceButton from './FilterSourceButton.tsx'; // Import the FilterSourceButton
import DateRangeFilterButton from './DateFilter';
import CategoryFilter from './CategoryFilter';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
  children?: React.ReactNode; // Add children prop
}

function NavbarLink({ icon: Icon, label, active, onClick, children }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        {children || <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconRadar, label: 'Filter Sources' },
  { icon: IconCalendar, label: 'Filter Dates' },
  { icon: IconCategory, label: 'Filter Categories' },
  { icon: IconBookmark, label: 'Bookmarked Articles' },
  { icon: IconHome2, label: 'Sources' }
];

interface NavbarMinimalProps {
  sources: string[];
  categories: string[];
  selectedSources: string[];
  selectedCategories: string[];
  onFilterChange: (selectedSources: string[]) => void;
  onCategoryChange: (selectedCategories: string[]) => void;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  showBookmarkedArticles: boolean;
  toggleShowBookmarkedArticles: () => void;
  toggleSources: () => void; // Add this line
}

export function NavbarMinimal({ 
  sources, 
  categories, 
  selectedSources, 
  selectedCategories,
  onFilterChange, 
  onCategoryChange, 
  onDateRangeChange, 
  showBookmarkedArticles,
  toggleShowBookmarkedArticles,
  toggleSources // Add this line
}: NavbarMinimalProps) {
  const [active, setActive] = useState<number | null>(null);  // Allow no active state

  const handleFilterChange = (selectedSources: string[]) => {
    onFilterChange(selectedSources); // Propagate filter change
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    onDateRangeChange(startDate, endDate); // Propagate date range change
  };

  const handleCategoryChange = (selectedCategories: string[]) => {
    onCategoryChange(selectedCategories); // Propagate category change
    console.log('Selected Categories:', selectedCategories);
  };

  const handleClick = (index: number) => {
    setActive(active === index ? null : index); // Toggle active state
  };

  const handleSourcesClick = () => {
    toggleSources(); // Use the toggleSources function from props
    setActive(null); // Optionally reset the active state
  };

  const links = mockdata.map((link, index) => {
    if (link.label === 'Filter Sources') {
      return (
        <NavbarLink 
          key={link.label} 
          label={link.label} 
          active={index === active} 
          onClick={() => handleClick(index)} 
          icon={IconRadar}
        >
          <FilterSourceButton 
            sources={sources} 
            selectedSources={selectedSources} 
            onFilterChange={handleFilterChange} 
          /> {/* Use the FilterSourceButton as the icon */}
        </NavbarLink>
      );
    } else if (link.label === 'Filter Dates') {
      return (
        <NavbarLink 
          key={link.label} 
          label={link.label} 
          active={index === active} 
          onClick={() => handleClick(index)} 
          icon={IconCalendar}
        >
          <DateRangeFilterButton onDateRangeChange={handleDateRangeChange} />
        </NavbarLink>
      );
    } else if (link.label === 'Filter Categories') {
      return (
        <NavbarLink 
          key={link.label} 
          label={link.label} 
          active={index === active} 
          onClick={() => handleClick(index)} 
          icon={IconCategory}
        >
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories} // Pass selectedCategories
            onCategoryChange={handleCategoryChange}
          />
        </NavbarLink>
      );
    } else if (link.label === 'Bookmarked Articles') {
      return (
        <NavbarLink 
          key={link.label} 
          label={link.label} 
          active={showBookmarkedArticles} 
          onClick={toggleShowBookmarkedArticles} 
          icon={IconBookmark} 
        />
      );
    } else if (link.label === 'Sources') {
      return (
        <NavbarLink 
          key={link.label} 
          label={link.label} 
          active={index === active} 
          onClick={handleSourcesClick} 
          icon={IconHome2}
        />
      );
    }
    return (
      <NavbarLink
        {...link}
        key={link.label}
        active={index === active}
        onClick={() => handleClick(index)}
      />
    );
  });

  return (
    <nav className={classes.navbar}>
      <Center>
        {/* You can add a logo or anything else here */}
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}
