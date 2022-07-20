import React, { useState } from 'react';
import { Analytics } from '../../types/Core.types';

const AccordionItem = ({
  description,
  heading,
  icon,
  deviceType,
  browserType,
  os,
  actionInfo,
  sessionip,
}: any) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <div className={`p-1 drop-item ${show ? 'open' : 'close'}`} onClick={toggleShow}>
      <div className="drop-item-header">
        <div className="drop-item-icon" style={{ backgroundImage: `url("${icon}")` }} />
        <div className="drop-item-heading">{heading}</div>
        {!show && <div className="drop-item-content-preview">{description}</div>}
      </div>
      {show && (
        <div className="drop-item-description">
          <table style={{ width: '100%', margin: '1rem', textAlign: 'center' }}>
            <tr>
              <td>{description}</td>
              <td>{actionInfo}</td>
            </tr>
            <tr>
              <th>Action Type</th>
              <th>Action Payload</th>
            </tr>
          </table>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <p style={{ textAlign: 'center' }}>
              Device Type : <strong>{deviceType}</strong>
            </p>
            <p>
              Browser Type : <strong>{browserType}</strong>
            </p>
            <p>
              Operating System : <strong>{os}</strong>
            </p>
            <p>
              Session IP : <strong>{sessionip}</strong>
            </p>
          </div>
        </div>
      )}
      {/* {show && productName && <div className="drop-item-description">{productName}</div>} */}
    </div>
  );
};

const AnalyticsDropdown = ({ show, data }: { show: boolean; data: Array<Analytics> }) => {
  const [showDrop] = useState(show);

  const options = data.map((item: Analytics) => {
    return {
      heading: `${new Date(item.timeStamp).toLocaleDateString()}  ${new Date(
        item.timeStamp
      ).toLocaleTimeString()}`,
      label: item.actionName,
      //   author: 'author' in item ? item.author.name : null,
      description: item.actionName,
      icon: '/app/combined/analytics',
      browserType: item.browserType,
      deviceType: item.deviceType,
      os: item.os,
      actionInfo: item.actionInfo,
      sessionip: item.ipAddress,
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
            browserType={item.browserType}
            deviceType={item.deviceType}
            os={item.os}
            actionInfo={item.actionInfo}
            sessionip={item.sessionip}
          />
        ))}
    </div>
  );
};

export default AnalyticsDropdown;