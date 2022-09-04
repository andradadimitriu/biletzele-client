import React, {useEffect, useState} from "react";

import {myTurnToGuess} from "./utils/turns";
import {MESSAGE_TYPE} from "../utils/constants";
import websocket from "../service/reconnecting-websocket";

export default function NoAct({team, user, turn}) {
  const [lastWordGuessed, setLastWordGuessed] = useState(turn && turn.lastWordGuessed);

  useEffect(() => {
    function handleMessageOnNoAct(message) {
      const data = JSON.parse(message);
      console.log(`message received: ${message}`);
      if(data.type === MESSAGE_TYPE.NEXT_WORD) {
        setLastWordGuessed(data.lastWordGuessed);
      }
    }
    handleMessageOnNoAct.originalName="handleMessageOnNoAct"
    websocket.on(handleMessageOnNoAct);
    return () => websocket.off(handleMessageOnNoAct);

  },[]);

  function WhatToDo(){
    return <div className="big-sized-text">{myTurnToGuess(team, user) ?
        <Guess/>:
        <Standby/>}
    </div>;
  }

  return <div className="no-act">
    {lastWordGuessed && <div className="medium-sized-text">
      <div className="margin-half">Last word guessed</div>
      <div className="last-word-guessed margin-half">{lastWordGuessed}</div>
    </div>}
    <WhatToDo/>
  </div>;
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