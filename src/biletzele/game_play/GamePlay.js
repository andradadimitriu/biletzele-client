import React, {useEffect, useState} from "react";
import {GAME_STATUSES} from "../utils/constants";
import {useParams} from "react-router-dom";
import {Auth} from "aws-amplify";
import {getGame} from "../service/biletzele-service";
import {myTurnToAct, myTurnToGuess, who_sTurnToAct} from "./utils/turns";
import Act from "./Act";
import Loading from "../../utils_components/Loading";

export default function GamePlay(props) {
  const [game, setGame] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [teamTurn, setTeamTurn] = useState(undefined);
  const [playerTurn, setPlayerTurn] = useState(undefined);
  let { gameId } = useParams();

  useEffect(() => {
    (async function updateGameAndUser(){
      const currentUser = await Auth.currentCredentials();
      setUser(currentUser);
      //TODO would it be a good idea to get it from props when possible?
      const game = await getGame(gameId || props.gameId);
      const {teamTurn, playerTurn} = who_sTurnToAct(game.teams, game.turnNumber);
      setTeamTurn(teamTurn);
      setPlayerTurn(playerTurn);
      setGame(game);
    })();
  }, [gameId, props.gameId]);

  return user && game ?
      game.gameStatus === GAME_STATUSES.ACTIVE ?
        (myTurnToAct(playerTurn, user) ?
          <Act game={game}/>:
          myTurnToGuess(game.teams[teamTurn], playerTurn) ?
              <Guess/>:
              <Standby/>):
          <div>This is not an active game</div>:
      <Loading/>;
}

function Guess() {
  return "Time to guess";
}

function Standby() {
  return "The other team is playing. Pay attention to them";
}