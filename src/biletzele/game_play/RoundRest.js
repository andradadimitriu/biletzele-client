import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {newRound} from "../service/biletzele-service";

export default function RoundRest(props) {
  async function startRound(){
   const newRoundGame = props.round && await newRound(props.game.gameId, props.round.roundNo, props.game.words);
   props.setGame(newRoundGame);
  }
  return <div> Round {props.round.roundNo} ended.
      <Button onClick={startRound}> Start new round </Button>
  </div>;
}
