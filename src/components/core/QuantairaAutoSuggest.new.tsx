/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { getHighlightedText } from '../../utils/utilities';
import MultiLingualLabel from './MultiLingualLabel';

const QuantairaAutoSuggest = ({
  options,
  onChange,
  onSelect,
  placeHolder,
}: {
  options: Array<{ label: string; value: any }>;
  onChange?: any;
  placeHolder?: string;
  onSelect?: any;
}) => {
  const [showDrop, setShow] = useState(false);

  useEffect(() => {
    if (options.length > 0 && inputValue.length < 10) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [options]);

  const [inputValue, setInputValue] = useState('');

  return (
    <div className="quantaira-dropdown">
      <div className="dropdown-container">
        <input
          className="autosuggest-text-input"
          placeholder={placeHolder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(() => e.target.value);
            if (onChange) onChange(e.target.value);
          }}
        />
        <div className={`drop-container ${showDrop ? 'shown' : 'hidden'}`}>
          {options.length ? (
            options.map((item, index) => (
              <label htmlFor={`chekbox-${index}`} key={index} className="drop-item">
                <div
                  className="drop-item-header"
                  onClick={() => {
                    setShow(false);
                    console.log('Selected Item', item);
                    if (onSelect) onSelect(item.value);
                    setInputValue(item.label);
                  }}
                  dangerouslySetInnerHTML={{ __html: getHighlightedText(item.label, inputValue) }}
                ></div>
              </label>
            ))
          ) : (
            <p className="text-center m-0">
              <MultiLingualLabel id="NO_ITEMS_TO_SHOW" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantairaAutoSuggest;
