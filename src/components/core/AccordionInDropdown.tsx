import React, { useState } from 'react';
import { Medication, Note } from '../../types/Core.types';

const AccordionItem = ({ icon, label, description, heading, productName, author }: any) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => {
    setShow(!show);
  };
  return (
    <div className={`drop-item ${show ? 'open' : 'close'}`} onClick={toggleShow}>
      <div className="drop-item-header">
        <div className="drop-item-icon" style={{ backgroundImage: `url("${icon}")` }} />
        <div className="drop-item-heading">{heading}</div>
        <div className="drop-item-label">
          ({author}) {label} :{' '}
        </div>
        {!show && <div className="drop-item-content-preview">{description}</div>}
      </div>
      {show && <div className="drop-item-description">{description}</div>}
      {show && productName && <div className="drop-item-description">{productName}</div>}
      {show && author && (
        <div className="drop-item-description">
          Added by <strong>{author}</strong>
        </div>
      )}
    </div>
  );
};

const AccordionInDropdown = ({
  show,
  data,
}: {
  show: boolean;
  data: Array<Medication> | Array<Note>;
}) => {
  const [showDrop] = useState(show);

  const options = data.map((item: Medication | Note) => {
    return {
      heading: `${new Date(item.timeStamp).toLocaleDateString()}  ${new Date(
        item.timeStamp
      ).toLocaleTimeString()}`,
      label: 'author' in item ? item.author.role : null,
      author: 'author' in item ? item.author.name : null,
      description: item.note,
      icon: 'product' in item ? '/images/navbar/medication.svg' : '/images/navbar/notes.svg',
      productName: 'product' in item ? item.product.name : null,
    };
  });

  return (
    <div className={`accordion-drop-container ${showDrop ? 'shown' : 'hidden'}`}>
      {showDrop &&
        options.map((item, index: any) => (
          <AccordionItem
            key={index}
            icon={item.icon}
            label={item.label}
            description={item.description}
            heading={item.heading}
            productName={item.productName}
            author={item.author}
          />
        ))}
    </div>
  );
};

export default AccordionInDropdown;
