import React, {useEffect, useState} from "react";

import {getTurn} from "./utils/turns";
import {Row, Col,Button} from "react-bootstrap";
import {newTurn, nextWordToGuess} from "../service/biletzele-service";
import moment from "moment";
import Timer, {getCountDown} from "./Timer";
import {endTurn, endRound, endGame} from "../service/biletzele-websocket-service";
export default function Act(props) {

  const [turn, setTurn] = useState(getTurn(props.game));
  const [wordsLeft, setWordsLeft] = useState(props.round.wordsLeft);
  const [startTime, setStartTime] = useState((turn && turn.startTime && moment.utc(turn.startTime)) || undefined);
  const [outOfTime, setOutOfTime] = useState(startTime ? getCountDown(startTime)  <= 0 : undefined);

  async function startGuessing(){
    if(wordsLeft.length === 0){
      return;
    }
    const newStartTime = moment.utc();
    const index = Math.floor(Math.random() * wordsLeft.length);
    const updatedTurn = await newTurn(props.game.gameId, props.game.turnNumber, newStartTime, index);
    setStartTime(newStartTime);
    setTurn(updatedTurn);
  }

  async function nextWord(){
    if(wordsLeft.length === 0){
      return;
    }
    const newWordsLeft = wordsLeft.slice(0, turn.wordIndex).concat(wordsLeft.slice(turn.wordIndex + 1));
    const newWordIndex = Math.floor(Math.random() * newWordsLeft.length);
    await nextWordToGuess(props.game.gameId, turn.turnNo, props.round.roundNo, props.teamTurn, turn.wordIndex, newWordIndex);
    setTurn({...turn, wordIndex: newWordIndex});
    setWordsLeft(newWordsLeft);
  }

  useEffect(() => {
    (async function finishTurn(){
      if(turn){
        if(wordsLeft.length === 0 || outOfTime){
          if(wordsLeft.length === 0) {
            props.round.roundNo === props.game.noRounds ?
                await endGame(props.game.gameId, props.round.roundNo, turn.turnNo):
                await endRound(props.game.gameId, props.round.roundNo, turn.turnNo);
          }
          else if(outOfTime){
            await endTurn(props.game.gameId, turn.turnNo);
          }
          // props.reloadGame();
        }
      }
    })();
  }, [wordsLeft, outOfTime, props, turn]);

  return <div>
    {wordsLeft.length > 0 ?
      <Row style={{margin: 10}}>
        <Col> {(turn && (turn.wordIndex !== undefined)) ? <Button onClick={nextWord}> Next </Button>:
            <Button onClick={startGuessing}> Start </Button> }</Col>
        <Col>{turn && (turn.wordIndex !== undefined) && wordsLeft[turn.wordIndex]}</Col>
        <Col> {startTime && <Timer startTime={startTime} setOutOfTime={setOutOfTime} outOfTime={outOfTime}/>}</Col>
      </Row>:
        <div>Round ended</div>
    }
  </div>;
}