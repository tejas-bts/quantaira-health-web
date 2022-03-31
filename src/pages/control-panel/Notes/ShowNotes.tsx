import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccordionInDropdown from '../../../components/core/AccordionInDropdown';
import Button from '../../../components/core/Button';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';

const ShowNotes = () => {
  const navigate = useNavigate();
  const notes = useSelector((state: any) => state.notes.data);

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
          label={<MultiLingualLabel id="ADD_NOTES" />}
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
          cssWidth="12rem"
        />
      </div>
      <div className="notes-list">
        {notes.length > 0 && <AccordionInDropdown show={true} data={notes} />}
      </div>
    </div>
  );
};

export default ShowNotes;
