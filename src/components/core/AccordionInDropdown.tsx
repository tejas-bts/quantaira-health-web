import React, { useState } from 'react';

const AccordionItem = ({
  icon,
  label,
  description,
  heading,
  productName,
}: any) => {
  const [show, setShow] = useState(false);

  console.log('Product Name', productName);

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
        <div className="drop-item-heading">{heading}</div>
        <div className="drop-item-label">{label} : </div>
        {!show && (
          <div className="drop-item-content-preview">{description}</div>
        )}
      </div>
      {show && <div className="drop-item-description">{description}</div>}
      {show && productName && (
        <div className="drop-item-description">{productName}</div>
      )}
    </div>
  );
};

const AccordionInDropdown = ({ show, data }: { show: boolean; data: any }) => {
  const [showDrop] = useState(show);

  const options = data.map((item: any) => {
    console.log('Itemsaasadsaas', item);
    return {
      heading: `${new Date(item.inputTime).toLocaleDateString()}  ${new Date(
        item.inputTime
      ).toLocaleTimeString()}`,
      label: item.categoryName,
      description: item.inputContent,
      icon: item.productName
        ? '/images/navbar/medication.svg'
        : '/images/navbar/notes.svg',
      productName: item.productName,
    };
  });

  return (
    <div
      className={`accordion-drop-container ${showDrop ? 'shown' : 'hidden'}`}
    >
      {showDrop &&
        options.map(
          (
            item: {
              icon: any;
              label: any;
              description: any;
              heading: any;
              productName: any;
            },
            index: any
          ) => (
            <AccordionItem
              key={index}
              icon={item.icon}
              label={item.label}
              description={item.description}
              heading={item.heading}
              productName={item.productName}
            />
          )
        )}
    </div>
  );
};

export default AccordionInDropdown;
