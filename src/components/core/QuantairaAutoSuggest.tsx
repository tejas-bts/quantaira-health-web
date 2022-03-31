/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import MultiLingualLabel from './MultiLingualLabel';

const QuantairaAutoSuggest = ({
  options,
  onChange,
  onSelect,
  value,
}: {
  options: Array<string>;
  onChange?: any;
  value?: string;
  title: string;
  onSelect?: any;
}) => {
  const [showDrop, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  console.log('AutoSuggest Value', value);

  useEffect(() => {
    if (options.length > 0) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [options]);

  useEffect(() => {
    if (onSelect)
      onSelect(
        selectedOption,
        options.findIndex((item) => item === selectedOption)
      );
    setShow(false);
  }, [selectedOption]);

  return (
    <div className="quantaira-dropdown">
      <div className="dropdown-container">
        {/* <button
          className="dropdown-btn"
          onClick={() => {
            setShow(!showDrop);
          }}
        >
          <div>{selectedOption || value || title}</div>
          <div className="dropdown-arrow">
            {showDrop ? <BiChevronUp /> : <BiChevronDown />}
          </div>
        </button> */}
        <input
          className="autosuggest-text-input"
          placeholder="Start typing..."
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          value={value}
        />
        <div className={`drop-container ${showDrop ? 'shown' : 'hidden'}`}>
          {value && value.length < 10 && showDrop && options.length ? (
            options.map((item, index) => (
              <label htmlFor={`chekbox-${index}`} key={index} className="drop-item">
                <div
                  className="drop-item-header"
                  onClick={() => {
                    setSelectedOption(item);
                    setShow(false);
                  }}
                >
                  {item}
                </div>
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
