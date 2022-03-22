import React, { useState } from 'react';
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({
  defaultDate,
  size,
  showSeconds,
  onChange,
  disableFuture,
}: {
  size: 'lg' | 'md' | 'sm';
  defaultDate?: Date;
  showSeconds?: boolean | undefined;
  onChange?: any;
  disableFuture?: boolean;
}) => {
  const dateFormat = `MM/dd/yyyy h:mm${showSeconds ?? ':ss'} aa`;
  const [date, setDate] = useState<Date>(defaultDate ? defaultDate : new Date());
  // const [isLive, setLive] = useState()

  useEffect(() => {
    console.log('Default Date', date, dateFormat);
    if (onChange) onChange(date);
  }, [date]);

  if (defaultDate == undefined) {
    setTimeout(() => setDate(new Date()), 1000);
  }

  return (
    <div className="quantaira-date-time-picker-wrapper">
      <DatePicker
        selected={defaultDate ? defaultDate : date}
        onChange={(date: Date) => setDate(() => date)}
        timeInputLabel="Time:"
        dateFormat={dateFormat}
        className={`quantaira-date-time-picker ${size}`}
        showTimeInput
        maxDate={disableFuture ? new Date() : undefined}
        maxTime={disableFuture ? new Date() : undefined}
      />
    </div>
  );
};

export default DateTimePicker;
