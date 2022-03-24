import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const MultiLingualLabel = (props: any) => <FormattedMessage {...props} />;
export default injectIntl(MultiLingualLabel);
