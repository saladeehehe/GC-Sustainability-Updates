import { useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem} from '@mantine/core';
import {
  IconHome2,
  IconLogout,
  IconSwitchHorizontal,
  IconRadar,
  IconCalendar,
} from '@tabler/icons-react';
import classes from './NavbarMinimal.module.css';
import FilterSourceButton from './FilterSourceButton.tsx'; // Import the FilterSourceButton
import DateRangeFilterButton from './DateFilter';

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
  { icon: IconCalendar, label: 'Filter Dates' }
];

interface NavbarMinimalProps {
  sources: string[]; // Add sources prop
  onFilterChange: (selectedSources: string[]) => void;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

export function NavbarMinimal({ sources, onFilterChange, onDateRangeChange  }: NavbarMinimalProps) {
  const [active, setActive] = useState(2);
  
  const handleFilterChange = (selectedSources: string[]) => {
    onFilterChange(selectedSources); // Propagate filter change
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    onDateRangeChange(startDate, endDate); // Propagate date range change
  };

  const links = mockdata.map((link, index) => {
    if (link.label === 'Filter Sources') {
      return (
        <NavbarLink key={link.label} label={link.label} active={index === active} onClick={() => setActive(index)} icon={IconRadar}>
          <FilterSourceButton sources={sources} onFilterChange={handleFilterChange} /> {/* Use the FilterSourceButton as the icon */}
        </NavbarLink>
      );
    } else if (link.label === 'Filter Dates') {
        return (
          <NavbarLink key={link.label} label={link.label} active={index === active} onClick={() => setActive(index)} icon={IconCalendar}>
            <DateRangeFilterButton onDateRangeChange={handleDateRangeChange} />
          </NavbarLink>
        );
    }
    return (
      <NavbarLink
        {...link}
        key={link.label}
        active={index === active}
        onClick={() => setActive(index)}
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

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
