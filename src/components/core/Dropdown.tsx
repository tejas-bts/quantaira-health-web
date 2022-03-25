import React, { useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

const QuantairaDropdown = ({
  options,
  onChartAdded,
  onChartRemoved,
  selectedCharts,
}: {
  options: Array<string>;
  onChartAdded: any;
  onChartRemoved: any;
  selectedCharts: Array<string>;
}) => {
  const [showDrop, setShow] = useState(false);

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
          <div className="dropdown-arrow">{showDrop ? <BiChevronUp /> : <BiChevronDown />}</div>
        </button>
        <div className={`drop-container ${showDrop ? 'shown' : 'hidden'}`}>
          {showDrop && options.length ? (
            options.map((item, index) => (
              <label htmlFor={`chekbox-${index}`} key={index} className="drop-item">
                <div className="drop-item-header">
                  <input
                    className="form-check-input drop-item-check"
                    type="checkbox"
                    checked={selectedCharts && selectedCharts.includes(item)}
                    id={`chekbox-${index}`}
                    onChange={(e) => {
                      e.target.checked ? onChartAdded(item) : onChartRemoved(item);
                    }}
                  />
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
