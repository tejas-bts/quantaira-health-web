import React from 'react';
import Button from '../../../components/core/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { saveNote } from '../../../services/notes.services';
import DateTimePicker from '../../../components/core/DateTimePicker';
import { toast } from 'react-toastify';

const AddNote = () => {
  let selectedTime = new Date().getTime();
  const urlParams = useParams();
  if (urlParams.selectedTime) selectedTime = parseInt(urlParams.selectedTime);
  console.log('Selected Date', urlParams, selectedTime, new Date(selectedTime));
  // console.log('Selected Date Obj', new Date(selectedTime || '').toDateString());
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [isSaving, setSaving] = useState(false);

  const goBack = () => {
    navigate('/app/charts/notes', {
      replace: true,
    });
  };

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNote(e.target.value);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveNote({
        pid: '1234',
        device: '123',
        content: note,
        ipType: '2',
        categoryId: '2',
        inputTime: selectedTime,
      });
      goBack();
    } catch (e) {
      //Handle the error
      toast('Oops! There was an error trying to save this note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-notes-page">
      <div className="add-notes-heading">
        <div className="title">Add Notes</div>
        {selectedTime && (
          <DateTimePicker size={'sm'} defaultDate={new Date(selectedTime)} />
        )}
      </div>
      {/* <div className="add-notes-category">
        <AccordionInDropdown show={false} />
      </div> */}
      <div className="add-notes-text-area-input">
        <textarea
          className="quantaira-text-area"
          placeholder="Type notes here..."
          value={note}
          onChange={handleChange}
        />
      </div>
      <div className="add-notes-buttons">
        <Button
          // icon={'/images/notes-icon.svg'}
          label={'Cancel'}
          orientation={'horizontle'}
          size={'md'}
          type={'secondary'}
          shape={'rounded'}
          cssWidth={'6rem'}
          onClick={goBack}
        />
        <Button
          // icon={'/images/notes-icon.svg'}
          label={isSaving ? 'Saving' : 'Save'}
          orientation={'horizontle'}
          size={'md'}
          type={'primary'}
          onClick={handleSave}
          shape={'rounded'}
          cssWidth={'6rem'}
        />
      </div>
    </div>
  );
};

export default AddNote;
