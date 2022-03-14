import React, { useState } from 'react';

const AccordionItem = ({ icon, label, description }: any) => {
  const [show, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };
  return (
    <div
      className={`drop-item ${show ? 'open' : 'close'}`}
      onClick={toggleShow}
    >
      <div className="drop-item-header">
        <div
          className="drop-item-icon"
          style={{ backgroundImage: `url("${icon}")` }}
        />
        <div className="drop-item-heading">heading</div>
        <div className="drop-item-label">{label}</div>
      </div>
      {show && <div className="drop-item-description">{description}</div>}
    </div>
  );
};

const AccordionInDropdown = ({ show }: { show: boolean }) => {
  const [showDrop] = useState(show);
  const options1 = [
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    'b',
    'c',
    'd',
    'b',
    'c',
    'd',
    'b',
    'c',
    'd',
  ];
  const options = options1.map((item) => {
    return {
      heading: 'tejas',
      label: item,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      icon: 'https://cdn-icons-png.flaticon.com/512/6369/6369120.png',
    };
  });

  return (
    <div
      className={`accordion-drop-container ${showDrop ? 'shown' : 'hidden'}`}
    >
      {showDrop &&
        options.map((item, index) => (
          <AccordionItem
            key={index}
            icon={item.icon}
            label={item.label}
            description={item.description}
          />
        ))}
    </div>
  );
};

export default AccordionInDropdown;
