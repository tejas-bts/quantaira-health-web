/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Button from '../../../components/core/Button';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import DateTimePicker from '../../../components/core/DateTimePicker';
import { toast } from 'react-toastify';
import { saveMedication, searchMedications } from '../../../services/medications.services';
// import QuantairaAutoSuggest from '../../../components/core/QuantairaAutoSuggest';
import QuantairaAutoSuggest2 from '../../../components/core/QuantairaAutoSuggest.new';
import { useSelector } from 'react-redux';

const AddMedication = ({ onUpdate }: { onUpdate: any }) => {
  console.log('Add Medication');
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

  const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setNote(e.target.value);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('Payload', medicationOptions);
      await saveMedication({
        patientId: bed.patientID,
        device: '123',
        content: note,
        categoryId: '2',
        inputTime: selectedTime,
        productName: inputValue,
        item_id: selectedOption.row_id,
      });
      await onUpdate();
      toast('Your medication was saved successfully!');
      goBack();
    } catch (e) {
      toast('Oops! There was an error trying to save this note');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    console.log('Medication Data', medicationOptions);
  }, [medicationOptions]);

  const loadMedication = async (inputValue: any) => {
    const data = await searchMedications(inputValue);
    console.log('Medication Option', data);
    setMedicationOptions(() => {
      return data;
    });
  };

  useEffect(() => {
    if (inputValue && inputValue.length > 4 && inputValue.length < 8) {
      loadMedication(inputValue);
    }
  }, [inputValue]);

  return (
    <div className="add-notes-page">
      <div className="add-notes-heading">
        <div className="title">Add Medications</div>
        {selectedTime && <DateTimePicker size={'sm'} defaultDate={new Date(selectedTime)} />}
      </div>
      {/* <div
        className="add-notes-category"
        style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
      >
        <QuantairaAutoSuggest
          title="NDC Code"
          options={medicationOptions.map((item: any) => item.NDC)}
          onChange={(value: any) => setInputValue(value)}
          onSelect={(selectedValue: any, index: string | number) => {
            console.log('Selected Value', medicationOptions[index]);
            const selectedItem = medicationOptions[index];
            setItemId(selectedItem ? selectedItem.row_id : undefined);
            setInputValue(() =>
              medicationOptions[index]
                ? `${medicationOptions[index].product_name}`
                : 'NDC Code'
            );
          }}
          value={inputValue}
        />
      </div> */}
      <div
        className="add-notes-category"
        style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
      >
        <QuantairaAutoSuggest2
          options={medicationOptions.map((item: any) => {
            return {
              label: item.product_name,
              value: item,
            };
          })}
          onChange={(value: any) => setInputValue(value)}
          onSelect={(selectedValue: any) => setSelectedOption(selectedValue)}
        />
      </div>
      <div className="add-notes-text-area-input">
        <textarea
          className="quantaira-text-area"
          placeholder="Type notes here..."
          value={note}
          onChange={handleChange}
        />
      </div>
      <div className="add-notes-buttons">
        <Link to={`/app/charts/notes/add/${selectedTime}`} className="add-pointer-option-link">
          Add a note
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
