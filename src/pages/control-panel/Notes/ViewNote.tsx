import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AccordionInDropdown from '../../../components/core/AccordionInDropdown';
import { Note } from '../../../types/Core.types';

const ViewNote = () => {
  const { selectedTime } = useParams();
  const notes: Array<Note> = useSelector((state: any) => state.notes.data);
  const [targetNotes, setTargetNotes] = useState<Array<Note>>([]);

  useEffect(() => {
    console.log('Target Notes', targetNotes);
  }, [targetNotes]);

  useEffect(() => {
    if (selectedTime !== undefined && notes !== undefined) {
      const targetNotes = notes.filter((item: Note) => item.timeStamp === parseInt(selectedTime));
      setTargetNotes(targetNotes);
    }
  }, [selectedTime]);

  return targetNotes.length > 0 ? (
    <div className="show-notes-page">
      <div className="notes-list">
        {notes.length > 0 && <AccordionInDropdown show={true} data={targetNotes} />}
      </div>
    </div>
  ) : null;
};

export default ViewNote;
