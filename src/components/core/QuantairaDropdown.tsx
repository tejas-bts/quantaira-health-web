/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

const QuantairaDropdown = ({
  options,
  onChange,
  value,
  title,
}: {
  options: Array<string>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  value?: string;
  title: string;
}) => {
  const [showDrop, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    onChange(
      selectedOption,
      options.findIndex((item) => item === selectedOption)
    );
  }, [selectedOption]);

  return (
    <div className="quantaira-dropdown">
      <div className="dropdown-container">
        <button
          className="dropdown-btn"
          onClick={() => {
            setShow(!showDrop);
          }}
        >
          <div>{selectedOption || value || title}</div>
          <div className="dropdown-arrow">
            {showDrop ? <BiChevronUp /> : <BiChevronDown />}
          </div>
        </button>
        <div className={`drop-container ${showDrop ? 'shown' : 'hidden'}`}>
          {showDrop && options.length ? (
            options.map((item, index) => (
              <label
                htmlFor={`chekbox-${index}`}
                key={index}
                className="drop-item"
              >
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
            <p className="text-center m-0">No items to show</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantairaDropdown;
