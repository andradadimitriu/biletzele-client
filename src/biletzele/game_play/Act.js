import React, {useEffect, useState} from "react";

import {getTurn} from "./utils/turns";
import {Row, Col,Button} from "react-bootstrap";
import {endRound, endTurn, newTurn} from "../service/biletzele-service";
import moment from "moment";
const COUNTDOWN_SECONDS = 60;
export default function Act(props) {
  const turn = getTurn(props.game);
  const [wordsLeft, setWordsLeft] = useState(props.round.wordsLeft);
  const [wordToAct, setWordToAct] = useState((turn && turn.wordIndex && wordsLeft[turn.wordIndex]) || undefined);
  const [timer, setTimer] = useState((turn && turn.startTime && moment.utc(turn.startTime)) || undefined);
  const [outOfTime, setOutOfTime] = useState(false);

  async function startGuessing(){
    if(wordsLeft.length === 0){
      return;
    }
    const startTime = moment.utc();
    setTimer({startTime, countDown: getCountDown(startTime)});

    const index = Math.floor(Math.random() * wordsLeft.length);
    setWordToAct({word:wordsLeft[index], index});
    // addStartTimeToStorage(props.game, startTime);
    await newTurn(props.game.gameId, props.game.turnNumber, startTime.toString(), index);
  }

  function nextWord(){
    if(wordsLeft.length === 0){
      return;
    }
    wordsLeft.splice(wordToAct.index, 1);
    setWordsLeft(wordsLeft);
    // updateWordsLeftToStorage(props.game, wordsLeft);
    const index = Math.floor(Math.random() * wordsLeft.length);
    setWordToAct({word:wordsLeft[index], index});
  }

  useEffect(() => {
    (async function finishTurn(){
      if(wordToAct){
        let updatedGame;
        if(wordsLeft.length === 0) {
          updatedGame = await endRound(props.game.gameId, props.round.roundNo, turn.turnNo);
        }
        else if(outOfTime){
          updatedGame = await endTurn(props.game.gameId, turn.turnNo);
        }
        if(wordsLeft.length === 0 || outOfTime){
          props.setGame(updatedGame);
        }
      }
    })();
  }, [wordToAct, wordsLeft, outOfTime, props, turn]);

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
    {wordsLeft.length > 0 ?
      <Row style={{margin: 10}}>
        <Col>{wordToAct && wordToAct.word}</Col>
        <Col> {wordToAct ?<Button onClick={nextWord}> Next </Button>:
            <Button onClick={startGuessing}> Start </Button> }</Col>
        <Col> {timer && timer.countDown} </Col>
      </Row>:
        <div>Round ended</div>
    }
  </div>;
}

function getCountDown(startTime){
  return COUNTDOWN_SECONDS - Math.round(moment.duration(moment.utc().diff(startTime)).asSeconds());
}