import React, { useState, useRef, useEffect } from 'react';

const PatientIdInput = ({ value, ...props }: { value?: string }) => {
  const [isDisabled, setDisabled] = useState(true);
  const [isCardShown, setCardShown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef && inputRef.current && !isDisabled) {
      console.log('Input Ref', inputRef);
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isDisabled]);

  const showCard = () => {
    setCardShown(true);
  };

  const hideCard = () => {
    setCardShown(false);
  };

  return (
    <div
      className="patient-id-input-wrapper"
      {...props}
      onMouseEnter={showCard}
      onMouseLeave={hideCard}
    >
      <input
        type="text"
        className="patient-id-input text-center"
        disabled={isDisabled}
        ref={inputRef}
        value={value}
      />
      <button className="patient-id-input-edit-btn d-none" onClick={() => setDisabled(false)} />
      {isCardShown && (
        <div className="patient-card">
          <p className="mb-0 text-center mt-2">
            Name : <strong className="ml-2">Tejas Dadhe</strong>
          </p>
          <div className="d-flex justify-content-around">
            <p className="mb-0">
              Age : <strong>27 yrs</strong>
            </p>
            <p className="mb-0">
              Gender : <strong>Male</strong>
            </p>
          </div>
          <div className="d-flex justify-content-around">
            <p className="mb-0">
              Height : <strong>174 cm</strong>
            </p>
            <p className="mb-0">
              Weight : <strong>74 kg</strong>
            </p>
          </div>
          <p className="mb-0">
            Admission time : <strong>{new Date().toLocaleString()}</strong>{' '}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientIdInput;
