import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../sagas/.';
import moment from 'moment';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
  LOAD_MATCHS_REQUEST,
  LOAD_MATCHS_HISTORY_REQUEST,
} from '../sagas/match';

import { Table, Tag, Space, Button, Row, Col, Empty, Spin, Result } from 'antd';

import { AlignCenterOutlined, SyncOutlined } from '@ant-design/icons';
import SizeContext from 'antd/lib/config-provider/SizeContext';
import Notification from '../components/Notification';
require('moment-timezone');

// const limit = 100;
moment.tz.setDefault('Asia/Seoul');
const time_format = 'YYYY/MM/DD-HH:mm A';
const nowTime = moment().format(time_format);

const tagColor = (startTime, deadLine, deadLine_1, deadLine_24) => {
  if (nowTime > startTime) {
    return 'red';
  } else if (nowTime > deadLine) {
    return 'Orange';
  } else if (nowTime > deadLine_1) {
    return 'yellow';
  } else if (nowTime > deadLine_24) {
    return 'green';
  } else {
    return 'purple';
  }
};
const battingTag = (startTime, deadLine, deadLine_1, deadLine_24) => {
  if (nowTime > startTime) {
    // console.log(e);
    return '마감';
  } else if (nowTime > deadLine) {
    return '마감임박';
  } else if (nowTime > deadLine_1) {
    return '1시간 남음';
  } else if (nowTime > deadLine_24) {
    return '하루 남음';
  } else {
    return '테스트'; //내용 없으면 태그 쩜 왜 그럴까?
  }
};
const matchings = () => {
  const columns = [
    // {
    //   title: 'key',
    //   dataIndex: 'key',
    //   key: 'key',
    //   align: 'center',
    //   width: 50,
    // },
    {
      title: 'homeTeam',
      dataIndex: 'homeTeam',
      key: 'homeTeam',
      align: 'center',
      width: 160,
      render(text, record) {
        return {
          props: {
            style: { color: '#2c3e50' },
          },
          children: (
            <div>
              <strong>{text}</strong>
            </div>
          ),
        };
      },
    },
    {
      title: 'awayTeam',
      dataIndex: 'awayTeam',
      key: 'awayTeam',
      align: 'center',
      width: 160,
      render(text, record) {
        return {
          props: {
            style: { color: '#9b59b6' },
            // style: { color: 'red' },
          },
          children: (
            <div>
              <strong>{text}</strong>
            </div>
          ),
        };
      },
    },
    {
      title: '배팅인원',
      dataIndex: 'howManyPeopleBatted',
      key: 'howManyPeopleBatted',
      align: 'center',
      width: 50,
      render(text, record) {
        return {
          props: {
            style: { color: parseInt(text) > 0 ? '#e84118' : '#353b48' },
          },
          children: (
            <div>
              <strong>{text}</strong>
            </div>
          ),
        };
      },
      // sorter: (a, b) => a.howManyPeopleBatted - b.howManyPeopleBatted,
    },
    {
      title: 'startTime',
      dataIndex: 'startTime',
      key: 'startTime',
      align: 'center',
      width: 150,
      // rowClassName={},
      render(startTime, record) {
        return {
          props: {
            style: {
              // color: nowTime > record.deadLine ? 'red' : 'green',
            },
          },
          children: (
            <div>
              <strong>{startTime}</strong>
            </div>
          ),
        };
      },
    },
    {
      title: '배팅',
      dataIndex: '_id',
      key: '_id',
      width: 120,
      align: 'center',
      render: (_id, record) => (
        <Link href={{ pathname: 'match', query: { matchid: _id } }}>
          <a>
            <Button type="primary" htmlType="submit" danger>
              배팅
            </Button>
            <Tag
              style={{ marginLeft: '1rem' }}
              color={tagColor(
                record.startTime,
                record.deadLine,
                record.deadLine_1,
                record.deadLine_24
              )}
            >
              {battingTag(
                record.startTime,
                record.deadLine,
                record.deadLine_1,
                record.deadLine_24
              )}
            </Tag>
          </a>
        </Link>
      ),
    },
  ];

  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!me) {
      // Notification('로그인이 필요합니다!');  새로고침하면 왜 로그인 하라고 뜰까? me가 왜없냐
      // <Alert message="로그인이 필요합니다!" type="warning" showIcon closable />;
      // alert('로그인이 필요합니다!');
      // router.push('/');
    }
    dispatch({ type: LOAD_MATCHS_REQUEST });
    dispatch({ type: LOAD_MATCHS_HISTORY_REQUEST });
    // dispatch({ type: LOAD_MATCHS_REQUEST, index: -1 });
  }, [me]);
  const { matchs, matchsHistory } = useSelector((state) => state.match);

  if (!matchs)
    return (
      <Spin style={{ marginTop: '3rem', SizeContext: '10rem' }} size="large" />
    );

  if (matchs?.length < 0)
    return (
      <Row>
        <Row>로딩 중</Row>
        <Row>
          {/* <Table columns={columns} /> */}
          <Result
            status="warning"
            title="경기를 불러오지 못하였습니다!"
            // extra={
            //   <Button type="primary" key="console">
            //     Go Console
            //   </Button>
            // }
          />
          {/* <Spin /> */}
          {/* <Empty /> */}
        </Row>
      </Row>
    );
  const matchsData = [];
  for (let i = 0; i < matchs?.length; i++) {
    matchsData.push({
      key: i + 1,
      ...matchs[i],
      startTime: moment(matchs[i].startTime).format(time_format),
      finishTime: moment(matchs[i].finishTime).format(time_format),
      deadLine: moment(matchs[i].startTime)
        .subtract(5, 'minutes')
        .format(time_format),
      deadLine_1: moment(matchs[i].startTime)
        .subtract(1, 'hours')
        .format(time_format),
      deadLine_24: moment(matchs[i].startTime)
        .subtract(1, 'd')
        .format(time_format),
      // 마감시간 설정
      howManyPeopleBatted:
        matchs[i].homeBattingNumber +
        matchs[i].awayBattingNumber +
        matchs[i].drawBattingNumber,
    });
  }

  const matchsHistoryData = [];
  for (let i = 0; i < matchsHistory?.length; i++) {
    matchsHistoryData.push({
      key: i + 1,
      ...matchsHistory[i],
      startTime: moment(matchsHistory[i].startTime).format(time_format),
      finishTime: moment(matchsHistory[i].finishTime).format(time_format),
      deadLine: moment(matchsHistory[i].startTime)
        .subtract(5, 'minutes')
        .format(time_format),
      howManyPeopleBatted:
        matchsHistory[i].homeBattingNumber +
        matchsHistory[i].awayBattingNumber +
        matchsHistory[i].drawBattingNumber,
    });
  }

  return (
    <Row
      style={{
        textAlign: 'center',
        // padding: '20px',
        backgroundColor: 'white',
        //테이블 row들 왜 투명이냐 ..? Table 스타일로 수정
      }}
      justify="space-around"
    >
      <Row style={{ backgroundColor: 'white', padding: '20px' }}>
        <Row>
          <h2>진행 중</h2>
        </Row>
        <Table
          style={{ backgroundColor: 'white' }}
          columns={columns}
          dataSource={matchsData} // 현재 시간 이후의 배팅 // 진행 중
          pagination={{ pageSize: 5 }}
          // scroll={{ y: 300 }}
          rowClassName={(record, index) =>
            nowTime > record.deadLine
              ? 'red'
              : nowTime > record.deadLine_1
              ? 'green'
              : 'blue'
          }
          bordered
        />
        <Row>
          <h2>지난 배팅</h2>
        </Row>
        <Table
          style={{ backgroundColor: 'white' }}
          columns={columns}
          dataSource={matchsHistoryData.slice(0).reverse()} // 현재 시간 이전의 배팅 // 지난배팅
          pagination={{ pageSize: 5 }}
          rowClassName={(record, index) => 'gray'}
          // scroll={{ x: 50 }}
          bordered
        />
      </Row>
    </Row>
  );
};

export default matchings;
