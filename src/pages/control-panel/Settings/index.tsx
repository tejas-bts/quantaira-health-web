import React from 'react';
import SettingsItem from './SettingsItem';
import AppLocale from '../../../languages/index';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../../../reducers/language';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';

const Settings = () => {
  const language = useSelector((state: any) => state.language.selectedLanguage);
  const locale = useSelector((state: any) => state.language.selectedLocale);
  const dispatch = useDispatch();
  const handleSelectLanguage = (label: any, locale: any) => {
    dispatch(selectLanguage({ label, locale }));
  };

  console.log(language, locale);
  return (
    <div className="settings-wrapper">
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
    </div>
  );
};

export default Settings;
