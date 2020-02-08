import React from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Table } from 'antd';
import {
  IconButton,
  useToast,
  PopoverTrigger,
  Popover,
  PopoverArrow,
  PopoverHeader,
  PopoverContent,
  PopoverBody,
  Text,
  Link,
  Flex,
  Button
} from '@chakra-ui/core';
import Identicon from '@polkadot/react-identicon';
import { Amplitude } from '@amplitude/react-amplitude';
import './validatorTableStyle.css';

export default function ValidatorTable(props) {
  const [activePopover, setActivePopover] = React.useState('');
  const [redirect, setRedirect] = React.useState(false);
  const [validatorPath, setValidatorPath] = React.useState('');
  const [selectedValidators, updateSelectValidators] = React.useState([]);
  const { dataSource } = props;
  const { Column } = Table;
  const toast = useToast();
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
      updateSelectValidators(selectedRows);
    },
    getCheckboxProps: record => {
      //   console.log('record', record);
      return {
        name: record.stashId
      };
    },
    columnTitle: 'Stake',
    type: 'radio'
  };

  return (
    <React.Fragment>
      {redirect ? <Redirect to={validatorPath} /> : ''}
      <Amplitude>
        {({ logEvent }) => (
          <div style={{ overflowX: 'auto' }}>
            <Table
              className={
                props.colorMode === 'light' ? 'table-light' : 'table-dark'
              }
              rowKey="stashId"
              rowSelection={rowSelection}
              dataSource={dataSource}
              pagination={false}
              onRow={record => {
                return {
                  onClick: () => {
                    setValidatorPath(`/kusama/validator/${record.stashId}`);
                    setRedirect(true);
                  }
                };
              }}
            >
              <Column
                title="Name"
                key="name"
                dataIndex="name"
                align="left"
                render={(name, record) => (
                  <Flex alignItems="center">
                    <Identicon
                      value={record.stashId}
                      size={36}
                      theme="polkadot"
                    />
                    <Text ml={4}>{name}</Text>
                  </Flex>
                )}
              />
              <Column
                title={() => (
                  <React.Fragment>
                    <Popover
                      isOpen={activePopover === 'dailyEarning'}
                      trigger="hover"
                    >
                      <PopoverTrigger>
                        <Text>Daily Earning</Text>
                      </PopoverTrigger>
                      <PopoverContent border="0" zIndex={1000}>
                        <PopoverArrow />
                        <PopoverHeader>Daily Earning</PopoverHeader>
                        <PopoverBody>
                          <Text fontSize="md" fontWeight="normal" mb={4}>
                            Daily earning is the our approximate prediction
                            (actual values may vary) on the amount of KSM tokens
                            you could earn after 1 day based on the stake amount
                            you enter
                          </Text>
                          <Link
                            color="teal.500"
                            fontWeight="normal"
                            fontSize="md"
                            href="https://hackmd.io/-k2e9Xy0RCarSK8PIJjYuA#How-does-the-reward-prediction-logic-work"
                            isExternal
                          >
                            How are these values calculated?
                          </Link>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </React.Fragment>
                )}
                key="dailyEarning"
                dataIndex="dailyEarning"
                align="left"
                defaultSortOrder="descend"
                sorter={(a, b) =>
                  a.dailyEarning.slice(0, -5) - b.dailyEarning.slice(0, -5)
                }
                onHeaderCell={column => {
                  return {
                    onMouseEnter: () => {
                      setActivePopover(column.dataIndex);
                    },
                    onMouseLeave: () => {
                      setActivePopover('');
                    }
                  };
                }}
              />
              <Column
                title={() => (
                  <React.Fragment>
                    <Popover
                      isOpen={activePopover === 'commission'}
                      trigger="hover"
                    >
                      <PopoverTrigger>
                        <Text mr={4}>Commission</Text>
                      </PopoverTrigger>
                      <PopoverContent border="0" zIndex={1000}>
                        <PopoverArrow />
                        <PopoverHeader>Commission</PopoverHeader>
                        <PopoverBody>
                          <Text fontSize="md" fontWeight="normal" mb={4}>
                            Commission is the percentage of reward (set by the
                            validator) that the validator will keep and the rest
                            will be shared among them and their nominators
                          </Text>
                          <Link
                            color="teal.500"
                            fontSize="md"
                            fontWeight="normal"
                            href="https://guide.kusama.network/en/latest/try/validate/#validate"
                            isExternal
                          >
                            Go to Kusama Guide
                          </Link>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </React.Fragment>
                )}
                key="commission"
                dataIndex="commission"
                align="left"
                sorter={(a, b) =>
                  a.commission.slice(0, -1) - b.commission.slice(0, -1)
                }
                onHeaderCell={column => {
                  return {
                    onMouseEnter: () => {
                      setActivePopover(column.dataIndex);
                    },
                    onMouseLeave: () => {
                      setActivePopover('');
                    }
                  };
                }}
              />
              <Column
                title="Backers"
                key="noOfNominators"
                dataIndex="noOfNominators"
                align="left"
                render={count => (
                  <div style={{ textAlign: 'center' }}>{count}</div>
                )}
                defaultSortOrder="descend"
                sorter={(a, b) => a.noOfNominators - b.noOfNominators}
                onHeaderCell={column => {
                  return {
                    onMouseEnter: () => {
                      setActivePopover(column.dataIndex);
                    },
                    onMouseLeave: () => {
                      setActivePopover('');
                    }
                  };
                }}
              />
            </Table>
          </div>
        )}
      </Amplitude>
      {selectedValidators.length > 0 && (
        <div className="bottomCart">
          <div className="bottomCart-inner">
            <div className="selectView-outer">
              {selectedValidators.map(validator => (
                <div className="selectView-inner">
                  <p className="selectView-content">{validator.name}</p>
                </div>
              ))}
            </div>
            <div>
              <Button
                style={{
                  borderRadius: '18px',
                  background: '#40B5AF 0% 0% no-repeat padding-box',
                  color: '#fff'
                }}
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
