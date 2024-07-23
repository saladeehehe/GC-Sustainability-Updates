// src/components/DateRangeFilterButton.tsx
import React, { useState } from 'react';
import { Popover, UnstyledButton, Button, useMantineTheme } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';

interface DateRangeFilterButtonProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeFilterButton: React.FC<DateRangeFilterButtonProps> = ({ onDateRangeChange }) => {
  const theme = useMantineTheme();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [opened, setOpened] = useState(false);

  const handleApply = () => {
    onDateRangeChange(dateRange[0], dateRange[1]);
    setOpened(false);
  };

  return (
    <Popover
      width={300}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <UnstyledButton
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={() => setOpened((o) => !o)}
        >
          <IconCalendar size={20} stroke={1.5} />
          <span style={{ marginLeft: 10 }}>Filter by Date</span>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <DatePicker
          type = "range"
          value={dateRange}
          onChange={setDateRange}
          style={{ marginBottom: 10 }}
        />
        <Button onClick={handleApply}>Apply</Button>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DateRangeFilterButton;
