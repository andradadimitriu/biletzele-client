import React, {useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory, useParams } from "react-router-dom";
import {Auth} from "aws-amplify";
import Button from "react-bootstrap/Button";
import {getGame, startGame} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";
import {GAME_STATUS, MESSAGE_TYPE} from "../utils/constants";
import "../utils/utils.css";
import LoaderButton from "../../utils_components/LoaderButton";
import {isPlayerInGame} from "../utils/playerUtils";
import CouldNotFindGame from "../utils/CouldNotFindGame";
import websocket from '../service/reconnecting-websocket';

const MIN_PLAYERS_PER_TEAM = 2;
const STATUS_COLOR = {
  Ready: "success",
  Wait: "danger"
};

const WaitingRoom = ({setAppLevelGameId}) => {
  const history = useHistory();
  let { gameId } = useParams();
  const joinGameLink = `${window.location.origin}/biletzele/join-game/${gameId}`
  const [game, setGame] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [canStartGame, setCanStartGame] = useState(false);
  const [startsOrJoinsGame, setStartsOrJoinsGame] = useState(undefined);

  function getCreatorPlayerName() {
    const playerIdIndex = game.players.ids.findIndex(player => player === game.creator);
    if(playerIdIndex === -1){
      return "The creator of this game did not join yet. Wait for them to start the game.";
    }
    return game.players.playerNames[playerIdIndex];
  }

  async function startOrJoinGame(){
    if(game.gameStatus === GAME_STATUS.PENDING) {
      setStartsOrJoinsGame(true);
      await startGame(gameId);
      setStartsOrJoinsGame(false);
    }
    history.push(`/biletzele/game/${gameId}`);
  }

  useEffect(() => {
    (async function () {
      setAppLevelGameId(gameId);
    })();
  },[setAppLevelGameId, gameId]);

  useEffect(() => {
    function handleMessageOnWaitingRoom(message) {
      const data = JSON.parse(message);
      console.log(`message received: ${message}`);
      if (data.type === MESSAGE_TYPE.NEW_PLAYER) {
        setGame(data.game);
      }
    }
    websocket.on(handleMessageOnWaitingRoom);
    return () => websocket.off(handleMessageOnWaitingRoom);

  },[]);

  useEffect(() => {
    ( async function updateUser(){
      const currentUser = await Auth.currentCredentials();
      setUser(currentUser);
    })();
  }, []);

  useEffect(() => {
    ( async function updateGame(){
      //TODO would it be a good idea to get it from props when possible?
      const game = await getGame(gameId);
      setGame(game);
    })();
  }, [gameId]);

  useEffect(() => {
    ( async function updateCanStartGame(){
      function canUserStartGame(){
        if(!user || !game || game.gameNotFound){
          return false;
        }
        const pending = game.gameStatus === GAME_STATUS.PENDING;
        const rightUser = user.identityId === game.creator;
        const active = game.gameStatus === GAME_STATUS.ACTIVE ;
        const enoughUsers = Object.keys(game.teams).every(teamName => game.teams[teamName].members.length >= MIN_PLAYERS_PER_TEAM);
        return (pending && rightUser && enoughUsers)  || active;
      }
      setCanStartGame(canUserStartGame());
    })();
  }, [game, user]);
  return (
    <div style={{margin: 10}}>
      {game ?
          (game.gameNotFound ? <CouldNotFindGame/> :
            <div>
              <div style={{margin: 20}}>
                <Row className="centered-content"><strong>Game link</strong></Row>
                <Row className="centered-content">
                  <span className="center-text-vertically">{joinGameLink}</span>
                  <Button variant="light" style={{marginLeft: 5}} onClick={()=>{navigator.clipboard.writeText(joinGameLink)}}>Copy</Button>
                </Row>
              </div>
              <Row style={{margin: 10}}>Creator: {getCreatorPlayerName()}</Row>
              <div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
                {//TODO add loading screen when game is still loading
                   Object.keys(game.teams).map((teamName, id) =>
                      <TeamTable key={id} teamName={teamName} team={game.teams[teamName]}/>)
                }
              </div>
              <div className="centered-content">
                {
                  game.gameStatus ? ( isPlayerInGame(game, user) ?

                  <LoaderButton variant={canStartGame ? "danger" : "outline-secondary"} className="game-button"
                          disabled={!canStartGame}
                                isLoading={startsOrJoinsGame}
                          onClick={()=>{startOrJoinGame()}}
                  >
                    {game.gameStatus === GAME_STATUS.PENDING ?
                        "Start game" :
                        "Enter game"
                    }
                  </LoaderButton>:
                    "User not registered in game"):
                      "Game has ended"
                }
              </div>
            </div>
            )
          :<Loading/>}
    </div>
  );
}

function TeamTable({teamName, team}){
  return <div style={{flex: "auto",  padding:5 }}>
    <table className="table">
    <thead className="thead-dark">
    <tr>
      <th className="text-center" scope="col" colSpan={2} style={{backgroundColor: "pink"}}>{teamName}</th>
    </tr>
    <tr>
      <th scope="col">Player</th>
      <th scope="col">Status</th>
    </tr>
    </thead>
    <tbody>
    {//TODO have a button like view for status
      team && team.members.map((player, id) => <tr key={id}>
      <td>{player.playerName}</td>
      <td><Status status="Ready"/></td>
    </tr>)}
    </tbody>
  </table>
  </div>;
}

function Status({status}){
  return <Button variant={STATUS_COLOR[status]} className="game-button">
      {status}
  </Button>
}

export default WaitingRoom;