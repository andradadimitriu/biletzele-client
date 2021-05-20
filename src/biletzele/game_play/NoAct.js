import React, {useEffect, useState} from "react";

import {myTurnToGuess} from "./utils/turns";
import {Row} from "react-bootstrap";
import {MESSAGE_TYPE} from "../utils/constants";
import websocket from "../service/reconnecting-websocket";

export default function NoAct({team, user, turn}) {
  const [lastWordGuessed, setLastWordGuessed] = useState(turn && turn.lastWordGuessed);

  useEffect(() => {
    function handleMessageOnNoAct(message) {
      const data = JSON.parse(message);
      console.log(`message received: ${message}`);
      debugger;
      if(data.type === MESSAGE_TYPE.NEXT_WORD) {
        setLastWordGuessed(data.lastWordGuessed);
      }
    }
    websocket.on(handleMessageOnNoAct);
    return () => websocket.off(handleMessageOnNoAct);

  },[]);

  return <>
    {myTurnToGuess(team, user) ?
    <Guess/>:
    <Standby/>
    }
    {lastWordGuessed && <div style={{margin: 40}}>
      <Row className="justify-content-md-center" style={{margin: 10}}>Last word guessed:</Row>
      <Row className="justify-content-md-center" style={{margin: 10, color: "green", fontWeight: "bold"}}>{lastWordGuessed}</Row>
    </div>}
    </>
}

function Guess() {
  return <Row className="justify-content-md-center" style={{margin: 10}}><h3>Time to guess</h3></Row>;
}

function Standby() {
  return <Row className="justify-content-md-center" style={{margin: 10}}><h3>The other team is playing. Pay attention to them.</h3></Row>;
}