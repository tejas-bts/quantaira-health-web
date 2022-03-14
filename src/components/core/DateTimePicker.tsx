import React, { useState } from 'react';
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({
  defaultDate,
  size,
  showSeconds,
  onChange,
}: {
  size: 'lg' | 'md' | 'sm';
  defaultDate?: Date;
  showSeconds?: boolean | undefined;
  onChange?: any;
}) => {
  const dateFormat = `MM/dd/yyyy h:mm${showSeconds ?? ':ss'} aa`;
  const [date, setDate] = useState<Date>(defaultDate || new Date());
  useEffect(() => {
    console.log('Default Date', date, dateFormat);
    if (onChange) onChange(date);
  }, [date]);

  return (
    <div className="quantaira-date-time-picker-wrapper">
      <DatePicker
        selected={date}
        onChange={(date: Date) => setDate(() => date)}
        timeInputLabel="Time:"
        dateFormat={dateFormat}
        className={`quantaira-date-time-picker ${size}`}
        showTimeInput
      />
    </div>
  );
};

export default DateTimePicker;
