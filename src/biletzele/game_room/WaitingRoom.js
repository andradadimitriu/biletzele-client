import React, {useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory, useParams } from "react-router-dom";
import {Auth} from "aws-amplify";
import Button from "react-bootstrap/Button";
import {getGame, startGame} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";
import {GAME_STATUS} from "../utils/constants";
import "../utils/utils.css";
import LoaderButton from "../../utils_components/LoaderButton";
import {isPlayerInGame} from "../utils/playerUtils";

const STATUS_COLOR = {
  Ready: "success",
  Wait: "danger"
};
export default function WaitingRoom() {
  const history = useHistory();
  const [game, setGame] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [canStartGame, setCanStartGame] = useState(false);
  const [startsOrJoinsGame, setStartsOrJoinsGame] = useState(undefined);
  let { gameId } = useParams();

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
    ( async function updateGameAndUser(){
      function canUserStartGame(){
        return (user && game && game.gameStatus === GAME_STATUS.PENDING &&
            user.identityId === game.creator) ||
            game.gameStatus === GAME_STATUS.ACTIVE ;
      }
      const currentUser = await Auth.currentCredentials();
      //TODO would it be a good idea to get it from props when possible?
      const game = await getGame(gameId);
      setUser(currentUser);
      setGame(game);
      setCanStartGame(canUserStartGame());
    })();
  }, [gameId, user]);

  return (
    <div style={{margin: 10}}>
      {game ?
          (game.gameExists ?
            <div>
              <div style={{margin: 20}}>
                <Row className="centered-content"><strong>Game link</strong></Row>
                {/*TODO variable hostname*/}
                <Row className="centered-content">{window.location.origin}/biletzele/join-game/{gameId}</Row>
              </div>
              <Row style={{margin: 10}}>Creator: {getCreatorPlayerName()}</Row>
              <Row>
                {//TODO add loading screen when game is still loading
                   Object.keys(game.teams).map((teamName, id) =>
                  <Col key={id}>
                      <TeamTable teamName={teamName} team={game.teams[teamName]}/>
                  </Col>)
                }
              </Row>
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
            : <NoGame/>)
          :<Loading/>}
    </div>
  );
}

function TeamTable({teamName, team}){
  return <div>
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

function NoGame(){
  return <div>This game does not exist</div>;
}
