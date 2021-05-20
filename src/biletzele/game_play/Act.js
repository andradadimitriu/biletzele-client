import React, {useEffect, useState} from "react";

import {getTurn} from "./utils/turns";
import {Row, Col, Button, Alert} from "react-bootstrap";
import {newTurn} from "../service/biletzele-service";
import moment from "moment";
import Timer, {getCountDown} from "./Timer";
import {endTurn, endRound, endGame, nextWordToGuess} from "../service/biletzele-websocket-service";
import {MESSAGE_TYPE} from "../utils/constants";
import websocket from "../service/reconnecting-websocket";

export default function Act(props) {

  const [turn, setTurn] = useState(getTurn(props.game));
  const [wordsLeft, setWordsLeft] = useState(props.round.wordsLeft);
  const [newWordIndex, setNewWordIndex] = useState(undefined);
  const [startTime, setStartTime] = useState((turn && turn.startTime && moment.utc(turn.startTime)) || undefined);
  const [outOfTime, setOutOfTime] = useState(startTime ? getCountDown(startTime)  <= 0 : undefined);
  const [errorOnNext, setErrorOnNext] = useState(undefined);

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
    //wordsLeft.length - 1 is the length of the array after removing one word
    const newWordIndex = Math.floor(Math.random() * (wordsLeft.length - 1));
    setNewWordIndex(newWordIndex);
    await nextWordToGuess(props.game.gameId, turn.turnNo, props.round.roundNo, props.teamTurn, turn.wordIndex, newWordIndex, wordsLeft[turn.wordIndex]);
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
        }
      }
    })();
  }, [wordsLeft, outOfTime, props, turn]);

  useEffect(() => {
    function handleWhenAct(message) {
      const data = JSON.parse(message);
      switch (data.type) {
        case `${MESSAGE_TYPE.NEXT_WORD}_FAILURE`:
          setErrorOnNext(true);
          break;
        case `${MESSAGE_TYPE.NEXT_WORD}_SUCCESS`:
          const newWordsLeft = wordsLeft.slice(0, turn.wordIndex).concat(wordsLeft.slice(turn.wordIndex + 1));
          setTurn({...turn, wordIndex: newWordIndex});
          setWordsLeft(newWordsLeft);
          break;
        default:
      }
    }
    websocket.on(handleWhenAct);
    return () => websocket.off(handleWhenAct);
    },[turn, newWordIndex, wordsLeft]);

  return <div>
    {wordsLeft.length > 0 ?
        <div>
      <Row style={{margin: 10}}>
        <Col> {(turn && (turn.wordIndex !== undefined)) ? <Button onClick={nextWord}> Next </Button>:
            <Button onClick={startGuessing}> Start </Button> }</Col>
        <Col>{turn && (turn.wordIndex !== undefined) && wordsLeft[turn.wordIndex]}</Col>
        <Col> {startTime && <Timer startTime={startTime} setOutOfTime={setOutOfTime} outOfTime={outOfTime}/>}</Col>
      </Row>
          {errorOnNext &&  <Alert variant="danger" className="p-1" style={{fontSize: "0.8rem"}}>
            Oops! Something went wrong. Please try again.
          </Alert>}
        </div>:
        <div>Round ended</div>
    }
  </div>;
}