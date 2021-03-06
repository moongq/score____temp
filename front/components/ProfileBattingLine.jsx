import { Col, Row } from 'antd';
import React from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import match from '../pages/match';

import { LOAD_MATCHS_REQUEST } from '../sagas/match';
import { useEffect } from 'react';

const ProfileBattingLine = ({ batting }) => {
  const dispatch = useDispatch();

  const { matchs } = useSelector((state) => state.match);
  useEffect(() => {
    dispatch({
      type: LOAD_MATCHS_REQUEST,
      index: 1,
    });
    // 인덱스 같이 보내면 전체 경기 불러옴
  }, [batting]);

  const match = matchs?.filter((match) => match._id === batting.match);
  // console.log(match[0]?.homeTeam);
  //
  return (
    <Row>
      <Col span={8}>
        <h3>
          {match[0]?.homeTeam} VS {match[0]?.awayTeam}
        </h3>
      </Col>
      <Col span={8}>
        <h3>
          {batting.chooseHomeAwayDraw} 선택 - {batting.battingPoint}P
        </h3>
      </Col>
      <Col span={4}>
        <h3>+{batting.battingResult ? batting.resultPoint : 0} P </h3>
      </Col>
      <Col span={4}>
        <h3>{moment(batting.createdAt).format('YY-MM-DD HH:MM')}</h3>
      </Col>
    </Row>
  );
};

export default ProfileBattingLine;
