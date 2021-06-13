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
    handleMessageOnNoAct.originalName="handleMessageOnNoAct"
    websocket.on(handleMessageOnNoAct);
    return () => websocket.off(handleMessageOnNoAct);

  },[]);

  function WhatToDo(){
    return <div style={{textAlign: "center"}}>{myTurnToGuess(team, user) ?
        <Guess/>:
        <Standby/>}
    </div>;
  }

  return <div style={{marginTop: 40, fontSize: "8vw"}}>
    {lastWordGuessed && <div >
      <Row className="justify-content-md-center " style={{margin: 10}}>Last word guessed:</Row>
      <Row className="justify-content-md-center" style={{margin: 10, color: "green", fontWeight: "bold"}}>{lastWordGuessed}</Row>
    </div>}
    <WhatToDo />
  </div>
}


function Guess() {
  return <p>Time to guess</p>;
}

function Standby() {
  return <div>
    <p>The other team is playing.</p>
    <p>Pay attention to them.</p>
  </div>;
}