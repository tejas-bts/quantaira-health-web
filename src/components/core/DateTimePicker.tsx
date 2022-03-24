import React from 'react';
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

  return (
    <div className="quantaira-date-time-picker-wrapper">
      <DatePicker
        selected={defaultDate ? defaultDate : null}
        onChange={onChange}
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
