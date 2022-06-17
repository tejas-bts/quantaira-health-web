import React from 'react';
import SettingsItem from './SettingsItem';
import AppLocale from '../../../languages/index';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../../../reducers/language';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../utils/utilities';
import { FiUser } from 'react-icons/fi';

const Settings = () => {
  const language = useSelector((state: any) => state.language.selectedLanguage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSelectLanguage = (label: any, locale: any) => {
    dispatch(selectLanguage({ label, locale }));
  };

  return (
    <div className="settings-wrapper">
      <div className="user-details m-3 text-white">
        <div className="user-icon ">
          <FiUser />
        </div>
        <div>
          <span className="bold">
            <strong>{getCurrentUser().name}</strong>
          </span>
        </div>
      </div>
      <SettingsItem
        title={<MultiLingualLabel id="LANGUAGE" />}
        icon="/images/settings/language.svg"
        value={language}
      >
        {AppLocale.map((item: any, index: number) => (
          <p
            key={index}
            className={language == item.label ? 'selected' : ''}
            onClick={() => handleSelectLanguage(item.label, item.locale)}
          >
            {item.label}
          </p>
        ))}
      </SettingsItem>
      <SettingsItem
        title={<MultiLingualLabel id="ABOUT" />}
        icon="/images/settings/language.svg"
        value={''}
        onClick={() => navigate('/app/about', { replace: true })}
      />
    </div>
  );
};

export default Settings;
