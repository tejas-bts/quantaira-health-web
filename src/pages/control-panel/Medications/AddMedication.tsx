/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Button from '../../../components/core/Button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import DateTimePicker from '../../../components/core/DateTimePicker';
import { toast } from 'react-toastify';
import { saveMedication, searchMedications } from '../../../services/medications.services';
// import QuantairaAutoSuggest from '../../../components/core/QuantairaAutoSuggest';
import QuantairaAutoSuggest from '../../../components/core/QuantairaAutoSuggest.new';
import { useSelector } from 'react-redux';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';
import QuantairaSwitch from '../../../components/core/QuantairaSwitch';

const AddMedication = ({ onUpdate }: { onUpdate: any }) => {
  let selectedTime = new Date().getTime();
  const urlParams = useParams();
  if (urlParams.selectedTime) selectedTime = parseInt(urlParams.selectedTime);
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [isSaving, setSaving] = useState(false);

  const [item_id, setItemId] = useState(undefined);
  const [inputValue, setInputValue] = useState<any>(undefined);
  const [medicationOptions, setMedicationOptions] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<any>({});

  const bed: any = useSelector((state: any) => state.patient.bed);

  const goBack = () => {
    navigate('/app/charts/medications', {
      replace: true,
    });
  };

  const handleMedicationChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setNote(e.target.value);
  };

  const handleChangeDate = (e: Date) => {
    const timeStamp = e.getTime();
    navigate(`/app/charts/medications/add/${timeStamp}`, {
      replace: true,
    });
    console.log('Date Changed', timeStamp);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveMedication({
        patientId: bed.patientID,
        device: '123',
        content: note,
        inputTime: selectedTime,
        item_id: selectedOption.NDC,
        ndc: false,
      });
      await onUpdate();
      toast(<MultiLingualLabel id="SUCCESSFULLY_SAVED_MEDICATION" />);
      goBack();
    } catch (e) {
      toast(<MultiLingualLabel id="MEDICATION_SAVE_ERROR" />);
    } finally {
      setSaving(false);
    }
  };

  const loadMedication = async (inputValue: any) => {
    const data = await searchMedications(inputValue);
    setMedicationOptions(() => {
      return data;
    });
  };

  useEffect(() => {
    if (inputValue && inputValue.length > 1 && inputValue.length < 8) {
      loadMedication(inputValue);
    }
  }, [inputValue]);

  return (
    <div className="add-notes-page">
      <div className="add-notes-heading">
        <div className="title">
          <MultiLingualLabel id="ADD_MEDICATION" />
        </div>
        {selectedTime && (
          <DateTimePicker
            size={'sm'}
            defaultDate={new Date(selectedTime)}
            onChange={handleChangeDate}
          />
        )}
      </div>
      <div
        className="add-notes-category"
        style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
      >
        <QuantairaAutoSuggest
          placeHolder="Search available medicines with name"
          options={medicationOptions.map((item: any) => {
            return {
              label: item.product_name,
              value: item,
            };
          })}
          onChange={(value: any) => setInputValue(value)}
          onSelect={(selectedValue: any) => setSelectedOption(selectedValue)}
        />
        <QuantairaAutoSuggest
          placeHolder="Search available medicines with id"
          options={medicationOptions.map((item: any) => {
            return {
              label: item.product_name,
              value: item,
            };
          })}
          onChange={(value: any) => setInputValue(value)}
          onSelect={(selectedValue: any) => setSelectedOption(selectedValue)}
        />
        <QuantairaSwitch
          disabled
          onChange={(value: any) => console.log('Value', value)}
          label1={'Client'}
          label2={'NDC'}
        />
      </div>
      <div className="add-notes-text-area-input">
        <textarea
          className="quantaira-text-area"
          placeholder="Type notes here..."
          value={note}
          onChange={handleMedicationChange}
        />
      </div>
      <div className="add-notes-buttons">
        <Link to={`/app/charts/notes/add/${selectedTime}`} className="add-pointer-option-link">
          <MultiLingualLabel id="ADD_NOTES" />
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
            onClick={handleSave}
            shape={'rounded'}
            cssWidth={'6rem'}
            disabled={!selectedOption.row_id}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMedication;
