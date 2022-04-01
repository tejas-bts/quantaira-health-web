import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewNote = () => {
  const { noteId } = useParams();
  const notes = useSelector((state: any) => state.notes.data);
  const targetNote = notes.find((item: any) => item.row_id == noteId);

  return targetNote ? (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="d-flex flex-row w-100">
        <div className="m-3">
          <h5>Category</h5>
          {targetNote.categoryName}
        </div>
        <div className="m-3">
          <h5>Time</h5>
          {`${new Date(targetNote.inputTime).toLocaleDateString()}  --
            ${new Date(targetNote.inputTime).toLocaleTimeString()}`}
        </div>
      </div>
      <div className="d-flex flex-column m-3">
        <h5>Content :</h5>
        <h4>{targetNote.inputContent}</h4>
      </div>
    </div>
  ) : null;
};

export default ViewNote;
