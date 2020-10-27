import moment from 'moment';
import { unset } from 'lodash';
import { Store } from 'rc-field-form/lib/interface';

export const FinishPrepare = (values: Store) => {
  const submitValues = {};
  let uri = '';
  let method = '';
  Object.keys(values).forEach((key) => {
    submitValues[key] = values[key];
    // preprocessing datetime value
    if (moment.isMoment(values[key])) {
      submitValues[key] = values[key].format();
    }

    switch (key) {
      case 'uri':
        uri = values[key];
        unset(submitValues, key);
        break;
      case 'method':
        method = values[key];
        unset(submitValues, key);
        break;
      default:
        break;
    }
  });
  return { submitValues, uri, method };
};
