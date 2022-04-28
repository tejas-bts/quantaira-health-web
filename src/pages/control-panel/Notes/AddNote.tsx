import React from 'react';
import Button from '../../../components/core/Button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { saveNote } from '../../../services/notes.services';
import DateTimePicker from '../../../components/core/DateTimePicker';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';
import { Bed } from '../../../types/Core.types';

const AddNote = ({ onUpdate }: { onUpdate: () => void }) => {
  let selectedTime = new Date().getTime();
  const urlParams = useParams();
  if (urlParams.selectedTime) selectedTime = parseInt(urlParams.selectedTime);

  const navigate = useNavigate();
  const bed: Bed = useSelector((state: any) => state.patient.bed);

  const [note, setNote] = useState('');
  const [isSaving, setSaving] = useState(false);

  const goBack = () => {
    navigate('/app/charts/notes', {
      replace: true,
    });
  };

  const handleNoteChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setNote(e.target.value);
  };

  const handleChangeDate = (e: Date) => {
    const timeStamp = e.getTime();
    navigate(`/app/charts/notes/add/${timeStamp}`, {
      replace: true,
    });
    console.log('Date Changed', timeStamp);
  };

  const handleSaveAndRefresh = async () => {
    try {
      setSaving(true);
      await saveNote({
        patientId: bed.patientID.toString(),
        deviceId: '123',
        content: note,
        inputTimeStamp: selectedTime,
      });
      await onUpdate();
      toast(<MultiLingualLabel id="SUCCESSFULLY_SAVED_NOTE" />);
      goBack();
    } catch (e) {
      toast(<MultiLingualLabel id="NOTE_SAVE_ERROR" />);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-notes-page">
      <div className="add-notes-heading">
        <div className="title">
          <MultiLingualLabel id="ADD_NOTES" />
        </div>
        {selectedTime && (
          <DateTimePicker
            size={'sm'}
            defaultDate={new Date(selectedTime)}
            onChange={handleChangeDate}
          />
        )}
      </div>
      <div className="add-notes-text-area-input">
        <textarea
          className="quantaira-text-area"
          placeholder="Type notes here..."
          value={note}
          onChange={handleNoteChange}
        />
      </div>
      <div className="add-notes-buttons">
        <Link
          to={`/app/charts/medications/add/${selectedTime}`}
          className="add-pointer-option-link"
        >
          <MultiLingualLabel id="ADD_MEDICATION" />
        </Link>
        <div className="d-flex gap-2">
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
            onClick={handleSaveAndRefresh}
            shape={'rounded'}
            cssWidth={'6rem'}
          />
        </div>
      </div>
    </div>
  );
};

export default AddNote;
