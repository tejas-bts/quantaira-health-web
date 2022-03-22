import React, { useState, useRef, useEffect } from 'react';

const PatientIdInput = ({ value, ...props }: { value?: string }) => {
  const [isDisabled, setDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef && inputRef.current && !isDisabled) {
      console.log('Input Ref', inputRef);
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isDisabled]);

  return (
    <span className="patient-id-input-wrapper" {...props}>
      <input
        type="text"
        className="patient-id-input"
        disabled={isDisabled}
        ref={inputRef}
        value={value}
      />
      <button
        className="patient-id-input-edit-btn"
        onClick={() => setDisabled(false)}
      />
    </span>
  );
};

export default PatientIdInput;
