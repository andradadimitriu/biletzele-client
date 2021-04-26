import React, {useEffect, useState} from "react";
import {GAME_PLAY_REFRESH_MESSAGES, GAME_STATUS} from "../utils/constants";
import {useParams} from "react-router-dom";
import {Auth} from "aws-amplify";
import {getGame} from "../service/biletzele-service";
import {myTurnToAct, myTurnToGuess, who_sTurnToAct} from "./utils/turns";
import Act from "./Act";
import Loading from "../../utils_components/Loading";
import {getRound} from "./utils/rounds";
import RoundRest from "./RoundRest";
import CouldNotFindGame from "../utils/CouldNotFindGame";
import {Row} from "react-bootstrap";
import websocket from '../service/reconnecting-websocket';

export default function GamePlay({setAppLevelGameId}) {
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
    (async function () {
      setAppLevelGameId(gameId);
    })();
  },[setAppLevelGameId, gameId]);

  useEffect(() => {
    (async function updateGameAndUser(){
      const currentUser = await Auth.currentCredentials();
      setUser(currentUser);
      const game = await getGame(gameId);
      setGame(game);
    })();
  }, [gameId]);

  useEffect(() => {
    function handleMessage(message) {
      const data = JSON.parse(message);
      console.log(`message received: ${message}`);
      debugger;
      if (GAME_PLAY_REFRESH_MESSAGES.includes(data.type)) {
        debugger;
        setGame(data.game);
      }
    }
    websocket.on(handleMessage);
  },[]);

  useEffect(() => {
    (async function updateRoundAndTurn(){
      if(!game || game.gameNotFound){
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
          game.gameNotFound ? <CouldNotFindGame/> :
              (round.roundStatus === GAME_STATUS.ACTIVE ?
            <div>
              <Row style={{margin: 10}}>Player turn: {playerTurn.playerName}</Row>
              {myTurnToAct(playerTurn, user) ?
              <Act game={game} round={round} reloadGame={reloadGame} teamTurn={teamTurn}/>:
              myTurnToGuess(game.teams[teamTurn], user) ?
                  <Guess/>:
                  <Standby/>
              }
            </div>:
            <RoundRest round={round} game={game} reloadGame={reloadGame}/>):
      <Loading/>;
}

function Guess() {
  return <Row style={{margin: 10}}>Time to guess</Row>;
}

function Standby() {
  return <Row style={{margin: 10}}>The other team is playing. Pay attention to them.</Row>;
}
