// src/components/DateRangeFilterButton.tsx
import React, { useState } from 'react';
import { Popover, UnstyledButton, Button } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import './DateFilter.css';

interface DateRangeFilterButtonProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangeFilterButton: React.FC<DateRangeFilterButtonProps> = ({ onDateRangeChange }) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [opened, setOpened] = useState(false);

  const handleApply = () => {
    console.log('Applying date range:', dateRange);
    
    onDateRangeChange(dateRange[0], dateRange[1]); //start date, end date
    setOpened(false);
  };
  const handleReset = () => {
    setDateRange([null, null]);
    onDateRangeChange(null, null);
    setOpened(false);
  };

  return (
    <Popover
      position="right"
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
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <DatePicker
          type = "range"
          allowSingleDateInRange 
          value={dateRange}
          onChange={setDateRange}
           
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Button onClick={handleApply}>Apply</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DateRangeFilterButton;
