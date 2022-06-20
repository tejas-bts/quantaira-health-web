/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { values } from 'lodash';
import React, { useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import MultiLingualLabel from './MultiLingualLabel';
// import { useNavigate } from 'react-router-dom';

const NavDropItem = ({
  title,
  icon,
  value,
  children,
  onClick,
}: {
  title: string | React.ReactElement;
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
    <div className="settings-item" onClick={onClick} >
      <div className="settings-header" onClick={toggleOpen}>
        <div className="settings-icon" style={{ backgroundImage: `url('${icon}')` }} />
        <div className="d-flex flex-column flex-1">
          <div className="settings-item-title">{title}</div>
          <div className="settings-item-value">{value}</div>
        </div>
        <div className={`settings-open-icon ${children ? (isOpen ? 'open' : 'closed') : ''}`} >
          <BsChevronRight />
        </div>
      </div>
      {children && (
        <div className={`settings-item-drop ${isOpen ? 'open' : 'closed'}`} 
        >{children}</div>
      )}
    </div>
  );
};

const NavigationDropDown = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const views = [
    {
      name: 'Charts',
      path: 'charts',
    },
    {
      name: 'Biometrics',
      path: 'kpi',
    },
    {
      name: 'Combined View',
      path: 'combined-charts',
    },
  ];

  const pathName = location.pathname;
  const path = pathName.substring(pathName.lastIndexOf('/') + 1);

  const defaultView = views.find((item) => item.path == path);

  const [selectedValue, setSelectedValue] = useState(defaultView ?? views[0]);

  const handleSelectView = (view: { name: string; path: string }) => {
    setSelectedValue(view);
    navigate(view.path, { replace: true });
  };

  return (
    <div className="nav-dropdown-wrapper" >
      <NavDropItem
        title={<MultiLingualLabel id="SELECT_VIEW" />}
        icon="/images/settings/language.svg"
        value={selectedValue.name}
      >
        {views.map((item: { name: string; path: string }, index: number) => (
          <p
            key={index}
            className={selectedValue.name == item.name ? 'selected' : ''}
            onClick={() => handleSelectView(item)}
          >
            {item.name}
          </p>
        ))}
      </NavDropItem>
    </div>
  );
};

export default NavigationDropDown;
