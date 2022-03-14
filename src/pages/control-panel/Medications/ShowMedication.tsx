import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/core/Button';

const ShowNotes = () => {
  const navigate = useNavigate();
  return (
    <div className="show-notes-page">
      <div className="notes-page-header">
        <input className="notes-input-field" placeholder="Search notes here" />
        <Button
          orientation={'vertical'}
          icon="/images/filters-icon.svg"
          size={'lg'}
          type={'secondary'}
          onClick={undefined}
          shape={'rectangular'}
          cssBorder="none"
        />
        <Button
          label="Add Medication"
          onClick={() => {
            navigate('/app/charts/notes/add', {
              replace: true,
            });
          }}
          icon="/images/notes-icon.svg"
          orientation={'horizontle'}
          size={'lg'}
          type={'primary'}
          shape={'rectangular'}
          cssWidth="14rem"
        />
      </div>
    </div>
  );
};

export default ShowNotes;
