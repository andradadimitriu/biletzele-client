import React, {useEffect, useState} from "react";
import { getGame } from "../../libs/utils";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from "react-router-dom";
import {Auth} from "aws-amplify";
import Button from "react-bootstrap/Button";

export default function WaitingRoom(props) {
  let { gameId } = useParams();
  const [game, setGame] = useState(false);
  const [user, setUser] = useState(undefined);

  async function updateGameAndUser(){
    setGame(getGame(gameId));
    //TODO would it be a good idea to get it from props when possible?
    const currentUser = await Auth.currentAuthenticatedUser();
    setUser(currentUser);
  }

  useEffect(() => {
    updateGameAndUser();
  }, []);

  return (
    <div>
      <Row>
        {//TODO add loading screen when game is not available yet
          game && game.teams.map((team, id) =>
          <Col>
              <TeamTable key={id} team={team}/>
          </Col>)
        }
      </Row>
    </div>
  );
}

function TeamTable({team}){
  return <div>
    <table className="table">
    <thead className="thead-dark">
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

const STATUS_COLOR = {
  Ready: "success",
  Wait: "danger"
};

function Status({status}){
  return <Button variant={STATUS_COLOR[status]} className="game-button">
      {status}
  </Button>
}
//TODO Add score to teams
//TODO change player to email or id
//TODO Add rounds, usedWords
//TODO Add status to waiting room