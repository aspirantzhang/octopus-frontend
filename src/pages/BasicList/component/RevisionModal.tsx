import React, { useEffect, useState, useCallback } from 'react';
import { Modal as AntdModal, message, List, Popconfirm, Tooltip } from 'antd';
import { useRequest, useIntl } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { InfoCircleTwoTone } from '@ant-design/icons';
import RevisionView from './RevisionView';

type RevisionResponse = {
  data: { dataSource: RevisionRecord[]; meta: { total: number; page: number } };
};
type RevisionRecord = {
  id: number;
  title: string;
  create_time: string;
  update_time: string;
};

const RevisionModal = ({
  visible,
  onHide,
  uri,
}: {
  visible: boolean;
  onHide: (reload?: boolean) => void;
  uri: string;
}) => {
  const [pageQuery, setPageQuery] = useState('&page=1');
  const [viewVisible, setViewVisible] = useState(false);
  const [viewUri, setViewUri] = useState('');
  const lang = useIntl();

  const init = useRequest<RevisionResponse>(`${uri}?${pageQuery}`, {
    manual: true,
    onError: () => {
      onHide();
    },
  });
  const request = useRequest(
    (revisionId: number) => {
      message.loading({
        content: lang.formatMessage({
          id: 'basic-list.processing',
        }),
        key: 'process',
        duration: 0,
        className: 'process-message',
      });
      return {
        url: `${uri}`,
        method: 'post',
        data: {
          revisionId,
        },
      };
    },
    {
      manual: true,
      onSuccess: (res: BasicListApi.Root) => {
        message.success({
          content: res?.message,
          key: 'process',
          className: 'process-message',
        });
        onHide(true);
      },
      formatResult: (res: any) => {
        return res;
      },
      throttleInterval: 1000,
    },
  );

  useEffect(() => {
    if (visible) {
      init.run();
    }
  }, [visible]);

  useUpdateEffect(() => {
    init.run();
  }, [pageQuery]);

  return (
    <div>
      <AntdModal
        title={lang.formatMessage({
          id: 'basic-list.revision',
        })}
        visible={visible}
        onCancel={() => {
          onHide();
        }}
        forceRender
        className="revision-modal"
        afterClose={() => {
          setPageQuery('&page=1');
        }}
      >
        <List
          className="demo-loadmore-list"
          loading={init.loading}
          itemLayout="horizontal"
          pagination={{
            onChange: (page) => {
              setPageQuery(`&page=${page}`);
            },
            pageSize: 5,
            total: init.data?.meta.total || 0,
            current: init.data?.meta.page || 1,
          }}
          dataSource={init.data?.dataSource || []}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Are you sure?"
                  onConfirm={() => {
                    request.run(item.id);
                  }}
                >
                  <a key="restore" className="restore-btn">
                    {lang.formatMessage({
                      id: 'basic-list.revision.restore',
                    })}
                  </a>
                </Popconfirm>,
                <a
                  key="view"
                  className="view-btn"
                  onClick={(event) => {
                    event.preventDefault();
                    setViewUri(`${uri}/${item.id}`);
                    setViewVisible(true);
                  }}
                >
                  {lang.formatMessage({
                    id: 'basic-list.revision.view',
                  })}
                </a>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Tooltip placement="right" title={item.update_time}>
                    <InfoCircleTwoTone />
                  </Tooltip>
                }
                title={`[${item.id}] ${item.title}`}
                description={<>{item.create_time}</>}
              />
            </List.Item>
          )}
        />
      </AntdModal>
      <RevisionView
        visible={viewVisible}
        onHide={useCallback(() => {
          setViewVisible(false);
        }, [])}
        uri={viewUri}
      />
    </div>
  );
};

export default React.memo(RevisionModal);
