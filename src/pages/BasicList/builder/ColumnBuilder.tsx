import moment from 'moment';
import { Space, Tag } from 'antd';
import { searchTree } from '../helper';
import ActionBuilder from './ActionBuilder';
import I18nFlagBuilder from './I18nFlagBuilder';

const ColumnBuilder = (
  tableColumn: BasicListApi.Field[] | undefined,
  actionHandler: BasicListApi.ActionHandler,
) => {
  const newColumns: BasicListApi.Field[] = [];
  (Array.isArray(tableColumn) ? tableColumn : []).forEach((column) => {
    if (column.hideInColumn !== true) {
      switch (column.type) {
        case 'datetime':
          column.render = (value: any) => {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          };
          break;
        case 'switch':
          column.render = (value: any) => {
            const option = (column.data || []).find(
              (item: any) => item.value?.toString() === value?.toString(),
            );
            return <Tag color={value ? 'blue' : 'red'}>{option?.title}</Tag>;
          };
          break;
        case 'radio':
          column.render = (value: any) => {
            const option = (column.data || []).find((item: any) => item.value === value);
            return <Tag>{option?.title}</Tag>;
          };
          break;
        case 'category':
        case 'parent':
          column.render = (value: any) => {
            const option = searchTree(column.data, value, 'id');
            return option?.title;
          };
          break;
        case 'i18n':
          column.render = (value: any, record: any) => {
            return I18nFlagBuilder(value, record, actionHandler);
          };
          break;
        case 'actions':
          column.render = (_: any, record: any) => {
            return <Space>{ActionBuilder(column.data, actionHandler, false, record)}</Space>;
          };
          break;

        default:
          break;
      }
      column.key = column.name;
      column.dataIndex = column.name;
      newColumns.push(column);
    }
  });

  const idColumn: BasicListApi.Field[] = [
    {
      name: 'id',
      dataIndex: 'id',
      key: 'id',
      title: 'ID',
      sorter: true,
    },
  ];

  return idColumn.concat(newColumns);
};

export default ColumnBuilder;
