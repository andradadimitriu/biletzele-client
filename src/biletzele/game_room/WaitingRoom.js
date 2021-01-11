import React, {useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory, useParams } from "react-router-dom";
import {Auth} from "aws-amplify";
import Button from "react-bootstrap/Button";
import {getGame, startGame} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";
import {GAME_STATUSES} from "../utils/constants";
import "../utils/utils.css";
import LoaderButton from "../../utils_components/LoaderButton";

const STATUS_COLOR = {
  Ready: "success",
  Wait: "danger"
};
export default function WaitingRoom() {
  const history = useHistory();
  const [game, setGame] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [startsOrJoinsGame, setStartsOrJoinsGame] = useState(undefined);
  let { gameId } = useParams();

  function getCreatorPlayerName() {
    const playerIdIndex = game.players.ids.findIndex(player => player === game.creator);
    if(playerIdIndex === -1){
      return "The creator of this game did not join yet. Wait for them to start the game.";
    }
    return game.players.playerNames[playerIdIndex];
  }
  function canStartGame(){
    return (user && game && game.gameStatus === GAME_STATUSES.PENDING &&
        user.identityId === game.creator) ||
        game.gameStatus === GAME_STATUSES.ACTIVE;
  }
  async function startOrJoinGame(){
    if(game.gameStatus === GAME_STATUSES.PENDING) {
      setStartsOrJoinsGame(true);
      await startGame(gameId);
      setStartsOrJoinsGame(false);
    }
    history.push(`/biletzele/game/${gameId}`);
  }

  useEffect(() => {
    ( async function updateGameAndUser(){
      const currentUser = await Auth.currentCredentials();
      setUser(currentUser);
      //TODO would it be a good idea to get it from props when possible?

      const game = await getGame(gameId);
      setGame(game);
    })();
  }, [gameId]);

  return (
    <div style={{margin: 10}}>
      {game ?
          (game.gameExists ?
            <div>
              <div style={{margin: 20}}>
                <Row className="centered-content"><strong>Game link</strong></Row>
                {/*TODO variable hostname*/}
                <Row className="centered-content">http://localhost:3000/biletzele/join-game/{gameId}</Row>
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
                  game.gameStatus ?
                  <LoaderButton variant="danger" className="game-button"
                          disabled={!canStartGame()}
                                isLoading={startsOrJoinsGame}
                          onClick={()=>{startOrJoinGame()}}
                  >
                    {game.gameStatus === GAME_STATUSES.PENDING ?
                        "Start game" :
                        "Join game"
                    }
                  </LoaderButton>:
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



//TODO Add score to teams
//TODO change player to email or id
//TODO Add rounds, usedWords
//TODO Add status to waiting room