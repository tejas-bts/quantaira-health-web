import React, { useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';

const SettingsItem = ({
  title,
  icon,
  value,
  children,
  onClick,
}: {
  title: any;
  icon: string;
  value: string;
  children?: any;
  onClick?: any;
}) => {
  const [isOpen, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((currentState) => !currentState);
  };

  return (
    <div className="settings-item" onClick={onClick}>
      <div className="settings-header" onClick={toggleOpen}>
        <div className="settings-icon" style={{ backgroundImage: `url('${icon}')` }} />
        <div className="d-flex flex-column flex-1">
          <div className="settings-item-title">{title}</div>
          <div className="settings-item-value">{value}</div>
        </div>
        <div className={`settings-open-icon ${children ? (isOpen ? 'open' : 'closed') : ''}`}>
          <BsChevronRight />
        </div>
      </div>
      {children && (
        <div className={`settings-item-drop ${isOpen ? 'open' : 'closed'}`}>{children}</div>
      )}
    </div>
  );
};

export default SettingsItem;
