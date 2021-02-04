import React from 'react';
import {Card} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import "./PendingGameTile.css";
import {isPlayerInGame} from "../utils/playerUtils";
const teamColors = (id) => id % 2 === 0 ? "primary" : "info";

export default function GameTile (props)  {
return (
    <Card className="margin" style={{ width: '24rem'}}>
      <Card.Body>
        <Row>
          <Col xs={8}><Card.Title style={{paddingRight: 0}}>{props.game.gameName}</Card.Title></Col>
          <Col xs={4} style={{paddingRight: 0}}>
              {isPlayerInGame(props.game, props.user) && <Button variant="danger" className="game-button">
                <Card.Link href={`/biletzele/waiting-room/${props.game.gameId}`}>Join</Card.Link>
              </Button>}
          </Col>
       </Row>

        <Card.Subtitle className="mb-2 text-muted">{props.game.gameStatus}</Card.Subtitle>
        <div>
          <span className="bordered-box">{props.game.words.length}</span> words added in the hat.
        </div>
        <br/>
        <br/>
        {!isPlayerInGame(props.game, props.user) &&
            <>
          <Card.Text>
          Choose your team.
        </Card.Text>
        <div>
            {Object.keys(props.game.teams).map((teamName, id) =>
                <TeamDisplay key={id} gameId={props.game.gameId} teamName={teamName} team={props.game.teams[teamName]} teamColor={teamColors(id)}/>
                )}
        </div>
        <div>
          <Card.Link href={`/biletzele/new-player/${props.game.gameId}/${chooseTeam(props.game.teams)}`}>Choose team for me.</Card.Link>
        </div>
          </>}
      </Card.Body>
    </Card>
)
};

function TeamDisplay({gameId, teamName, team, teamColor}){
    return <Card.Link href={`/biletzele/new-player/${gameId}/${teamName}`}>
        <Button variant={teamColor} className="game-button">
            {`${teamName} `}
            <span className="bordered-box">{team.members.length}/10</span>
        </Button>
    </Card.Link>;
}

function chooseTeam(teams){
    return Object.keys(teams).reduce((smallestTeamName, teamName) =>
        teams[teamName].members.length < teams[smallestTeamName].members.length ? teamName : smallestTeamName
        , Object.keys(teams)[0]);
}