import React, {useEffect, useState} from "react";
import {GAME_STATUS} from "../utils/constants";
import {useParams} from "react-router-dom";
import {Auth} from "aws-amplify";
import {getGame} from "../service/biletzele-service";
import {myTurnToAct, myTurnToGuess, who_sTurnToAct} from "./utils/turns";
import Act from "./Act";
import Loading from "../../utils_components/Loading";
import {getRound} from "./utils/rounds";
import RoundRest from "./RoundRest";
import CouldNotFindGame from "../utils/CouldNotFindGame";

export default function GamePlay(props) {
  const [round, setRound] = useState(undefined);
  const [game, setGame] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [teamTurn, setTeamTurn] = useState(undefined);

  const [playerTurn, setPlayerTurn] = useState(undefined);
  let { gameId } = useParams();

  async function reloadGame(){
    setGame(undefined);
    const updatedGame = await getGame(gameId)
    setGame(updatedGame);
  }

  useEffect(() => {
    (async function updateGameAndUser(){
      const currentUser = await Auth.currentCredentials();
      setUser(currentUser);
      //TODO would it be a good idea to get it from props when possible?
      const game = await getGame(gameId || props.gameId);
      setGame(game);
    })();
  }, [gameId, props.gameId]);

  useEffect(() => {
    (async function updateRoundAndTurn(){
      if(!(game && game.gameExists)){
        return;
      }
      const round = getRound(game);
      const {teamTurn, playerTurn} = who_sTurnToAct(game.teams, game.turnNumber);
      setTeamTurn(teamTurn);
      setPlayerTurn(playerTurn);
      setRound(round);
    })();
  }, [game]);

  return (user && game && round) ?
          game.gameExists ? (round.roundStatus === GAME_STATUS.ACTIVE ?
            (myTurnToAct(playerTurn, user) ?
              <Act game={game} round={round} reloadGame={reloadGame} teamTurn={teamTurn}/>:
              myTurnToGuess(game.teams[teamTurn], user) ?
                  <Guess/>:
                  <Standby/>):
            <RoundRest round={round} game={game} reloadGame={reloadGame}/>):
              <CouldNotFindGame/>:
      <Loading/>;
}

function Guess() {
  return "Time to guess";
}

function Standby() {
  return "The other team is playing. Pay attention to them";
}
