import React, {useEffect, useState} from "react";
import {GAME_PLAY_REFRESH_MESSAGES, GAME_STATUS, ROUNDS} from "../utils/constants";
import {useParams} from "react-router-dom";
import {Auth} from "aws-amplify";
import {getGame} from "../service/biletzele-service";
import {myTurnToAct, who_sTurnToAct} from "./utils/turns";
import Act from "./Act";
import Loading from "../../utils_components/Loading";
import {getRound} from "./utils/rounds";
import RoundRest from "./RoundRest";
import CouldNotFindGame from "../utils/CouldNotFindGame";
import {Badge, Row} from "react-bootstrap";
import websocket from '../service/reconnecting-websocket';
import NoAct from "./NoAct";
import MinimalCollapsible from "../utils/MinimalCollapsible";

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
    function handleMessageOnGamePlay(message) {
      const data = JSON.parse(message);
      console.log(`message received: ${message}`);
      if (GAME_PLAY_REFRESH_MESSAGES.includes(data.type)) {
        setGame(data.game);
      }
    }
    websocket.on(handleMessageOnGamePlay);
    return () => websocket.off(handleMessageOnGamePlay);
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
  return <div>{(user && game) ?
          game.gameNotFound ? <CouldNotFindGame/> : (round?
              <>
                {round.roundStatus === GAME_STATUS.ACTIVE ?
            <div>

              <Row style={{margin: 5}}>
                <h5>Player turn <Badge variant="info">{playerTurn.playerName}</Badge></h5>
              </Row>

              <MinimalCollapsible headerText={ROUNDS.find(r => r.type === round.roundType).name} content={ROUNDS.find(r => r.type === round.roundType).description}/>


              {myTurnToAct(playerTurn, user) ?
              <Act game={game} round={round} reloadGame={reloadGame} teamTurn={teamTurn}/>:
                  <NoAct team={game.teams[teamTurn]} user={user} turn={game.turn}/>}
            </div>:
            <RoundRest round={round} game={game} reloadGame={reloadGame}/>}
              </>:
              <Loading/>)
                :
      <Loading/>}
  </div>;
}


