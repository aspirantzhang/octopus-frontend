import React from 'react';
import moment from 'moment';
import { Space, Badge, Popover } from 'antd';
import { getLocale } from 'umi';
import FlagIcon from './FlagIcon';

const I18nFlagBuilder = (
  value: any,
  record: BasicListApi.Field,
  actionHandler: BasicListApi.ActionHandler,
) => {
  const currentLang: string = getLocale().toLowerCase();
  const currentLangTime = value[currentLang];
  return (
    <Space>
      {Object.keys(value).map((itemLang) => {
        const itemLangTime = value[itemLang];
        if (itemLang !== currentLang) {
          const popContent = (
            <>
              <FlagIcon code={currentLang} />{' '}
              {moment(currentLangTime).format('YYYY-MM-DD HH:mm:ss')}
              <br />
              <FlagIcon code={itemLang} />{' '}
              {itemLangTime ? moment(itemLangTime).format('YYYY-MM-DD HH:mm:ss') : 'Not exist'}
            </>
          );
          return (
            <span
              onClick={() => {
                actionHandler({ call: 'i18n' }, record);
              }}
              key={itemLang}
            >
              <Popover content={popContent}>
                <Badge
                  dot
                  count={itemLangTime === null || currentLangTime === itemLangTime ? 0 : 1}
                >
                  <FlagIcon
                    code={itemLang}
                    className={itemLangTime === null ? 'i18n-no-value' : undefined}
                  />{' '}
                </Badge>
              </Popover>
            </span>
          );
        }
        return null;
      })}
    </Space>
  );
};
export default I18nFlagBuilder;
