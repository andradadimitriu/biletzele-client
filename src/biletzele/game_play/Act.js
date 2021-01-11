import React, {useEffect, useState} from "react";

import {getRound} from "./utils/rounds";
import {Row, Col,Button} from "react-bootstrap";
import {newRound, updateRound} from "../service/biletzele-service";
import {getStartTime, getWordsLeft, addStartTimeToStorage, updateWordsLeftToStorage} from "../utils/localStorageUtils";
import moment from "moment";
const COUNTDOWN_SECONDS = 60;
export default function Act(props) {
  const round = getRound(props.game);
  const [wordsLeft, setWordsLeft] = useState(getWordsLeft(props.game, round));
  const [wordToAct, setWordToAct] = useState(undefined);
  const [timer, setTimer] = useState(undefined);
  const [outOfTime, setOutOfTime] = useState(false);

  function nextWord(){
    if(wordsLeft.length === 0){
      return;
    }
    if(!wordToAct){
      const startTime = getStartTime(props.game);
      setTimer({startTime, countDown: getCountDown(startTime)});
      addStartTimeToStorage(props.game, startTime);

    }
    if(wordToAct){
      wordsLeft.splice(wordToAct.index, 1);
      setWordsLeft(wordsLeft);
      updateWordsLeftToStorage(props.game, wordsLeft);
    }
    const index = Math.floor(Math.random() * wordsLeft.length);
    setWordToAct({word:wordsLeft[index], index});
  }

  useEffect(() => {
    (async function finishTurn(){
      if(wordToAct && (wordsLeft.length === 0 || outOfTime)){
        debugger;
        if (round.newRound) await newRound (props.game.gameId, round, wordsLeft);
        else await updateRound(props.game.gameId, round, wordsLeft);
      }
    })();
  }, [wordToAct, wordsLeft, outOfTime, props.game.gameId, round]);

  useEffect(() => {
    (function updateCountDown(){
      if(!timer) return;
      const interval = setInterval(() => {
        const countDown = getCountDown(timer.startTime);
        if(countDown <= 0){
          setOutOfTime(true);
        }

        setTimer({
          ...timer,
          countDown
        })
      }, 1000);
      return () => clearInterval(interval);

    })();
  }, [timer]);

  return <div>
    {round && wordsLeft.length > 0 ?
      <Row style={{margin: 10}}>
        <Col>{wordToAct && wordToAct.word}</Col>
        <Col> <Button onClick={nextWord}>{wordToAct ? "Next" : "Start"}</Button> </Col>
        <Col> {timer && timer.countDown} </Col>
      </Row>:
        <div>Round ended</div>
    }
  </div>;
}

function getCountDown(startTime){
  return COUNTDOWN_SECONDS - Math.round(moment.duration(moment.utc().diff(startTime)).asSeconds());
}