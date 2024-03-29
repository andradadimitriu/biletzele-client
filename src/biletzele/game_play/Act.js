import React, {useEffect, useState} from "react";

import {getTurn} from "./utils/turns";
import {Button} from "react-bootstrap";
import {newTurn} from "../service/biletzele-service";
import moment from "moment";
import Timer, {getCountDown} from "./Timer";
import {endGame, endRound, endTurn, nextWordToGuess} from "../service/biletzele-websocket-service";
import {MESSAGE_TYPE} from "../utils/constants";
import websocket from "../service/reconnecting-websocket";
import CustomisedAlert from "../../utils_components/Alerts";

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
    handleWhenAct.originalName = handleWhenAct;
    websocket.on(handleWhenAct);
    return () => websocket.off(handleWhenAct);
    },[turn, newWordIndex, wordsLeft]);

  function getContent(){
   return <div className="horizontalflex" style={{margin: 5, position: "absolute"}}>
     {
     (turn && (turn.wordIndex !== undefined)) ? <React.Fragment>
           <div style={{marginBottom: 10}}>{wordsLeft[turn.wordIndex]}</div>
           <div><Button variant="info" size="lg" onClick={nextWord}> Next </Button></div>
         </React.Fragment>
         :
        <Button variant="success" size="lg" onClick={startGuessing}>Start</Button>
     }
     <div>

     </div>
   </div>;
  }
  return <div>
    {wordsLeft.length > 0 ?
        <div>
         {<Timer startTime={startTime} setOutOfTime={setOutOfTime} content={getContent()}/>}
          {errorOnNext &&  <CustomisedAlert type="danger">
            Oops! Something went wrong. Please try again.
          </CustomisedAlert>}
        </div>:
        <div>Round ended</div>
    }
  </div>;
}