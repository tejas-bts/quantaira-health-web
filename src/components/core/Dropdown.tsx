import React, { useEffect, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

const QuantairaDropdown = ({
  options,
  onChange,
  selectedCharts,
}: {
  options: Array<string>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  selectedCharts: Array<string>;
}) => {
  const [showDrop, setShow] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Array<string>>([]);

  useEffect(() => {
    onChange(selectedOptions);
    console.log('Selected Charts', selectedCharts);
  }, [selectedOptions]);

  // useEffect(() => {
  //   setSelectedOptions(selectedCharts);
  // }, [selectedCharts]);

  return (
    <div className="quantaira-dropdown">
      <div className="dropdown-container">
        <button
          className="dropdown-btn"
          onClick={() => {
            setShow(!showDrop);
          }}
        >
          <div>Select Patient Report</div>
          <div className="dropdown-arrow">
            {showDrop ? <BiChevronUp /> : <BiChevronDown />}
          </div>
        </button>
        <div className={`drop-container ${showDrop ? 'shown' : 'hidden'}`}>
          {showDrop && options.length
            ? options.map((item, index) => (
              <label
                htmlFor={`chekbox-${index}`}
                key={index}
                className="drop-item"
              >
                <div className="drop-item-header">
                  <input
                    className="form-check-input drop-item-check"
                    type="checkbox"
                    checked={selectedOptions.includes(item)}
                    id={`chekbox-${index}`}
                    onChange={(e) => {
                      if (e.target.checked) {
                        console.log('Add', e);
                        setSelectedOptions((previousSelection) => [
                          ...previousSelection,
                          item,
                        ]);
                      } else {
                        setSelectedOptions((previousSelection) => {
                          return [
                            ...previousSelection.filter(
                              (i: string) => i !== item
                            ),
                          ];
                        });
                      }
                    }}
                  />
                  {item}
                </div>
              </label>
            ))
            : 'No items to show'}
        </div>
      </div>
    </div>
  );
};

export default QuantairaDropdown;
