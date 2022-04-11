import React, { useEffect, useRef, useState } from 'react';

const QuantairaSwitch = ({
  onChange,
  label1,
  label2,
  disabled,
}: {
  onChange: any;
  label1: any;
  label2: any;
  disabled?: boolean;
}) => {
  const item1: any = useRef(null);
  const item2: any = useRef(null);

  useEffect(() => {
    if (item1 != null && item2 != null && !disabled) {
      if (item1.current && item2.current)
        console.log('Items', item1.current.style.width, item2.current.style.width);
    }
  }, [item1, item2]);

  const toggleSelection = () => {
    if (selected == label1) {
      if (onChange) onChange(label2);
      setSelected(label2);
    } else {
      if (onChange) onChange(label1);
      setSelected(label1);
    }
  };

  const [selected, setSelected] = useState(label1);

  const id = (Math.random() * 100).toFixed(0);
  return (
    <div className="quantaira-switch-container">
      <input
        id={`quantaira-switch-${id}`}
        type="checkbox"
        checked={selected == label1}
        onClick={toggleSelection}
        disabled={disabled}
      />
      <label className="quantaira-switch" htmlFor={`quantaira-switch-${id}`}>
        <div className="quantaira-switch-active-bg" />
        <div className="quantaira-switch-items">
          <div
            ref={(item1: any) => {
              if (item1) {
                // console.log('Item1 %j', item1.height);
              }
            }}
          >
            {label1}
          </div>
          <div ref={item2}>{label2}</div>
        </div>
      </label>
    </div>
  );
};

export default QuantairaSwitch;
