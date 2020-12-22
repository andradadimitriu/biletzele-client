import React from 'react';
import {Card} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import "./PendingGameTile.css";
const teamColors = (id) => id % 2 === 0 ? "primary" : "info";

export default function GameTile (props)  {
return (
    <Card className="margin" style={{ width: '20rem'}}>
      <Card.Body>
        <Row>
          <Col xs={8}><Card.Title style={{paddingRight: 0}}>{props.game.gameName}</Card.Title></Col>
          <Col xs={4} style={{paddingRight: 0}}><Button variant="danger" className="game-button"><Card.Link href="#">Join</Card.Link></Button></Col>
       </Row>

        <Card.Subtitle className="mb-2 text-muted">{props.game.gameStatus}</Card.Subtitle>
        <div>
          <span className="bordered-box">{props.game.words.length}</span> words added in the hat.
        </div>
        <br/>
        <br/>
        <Card.Text>
          Choose your team.
        </Card.Text>
        <div>
            {Object.keys(props.game.teams).map((teamName, id) =>
                <TeamDisplay gameId={props.game.gameId} teamName={teamName} team={props.game.teams[teamName]} teamColor={teamColors(id)}/>
                )}
        </div>
        <div>
          <Card.Link href="#!">Randomly allocate me.</Card.Link>
        </div>
      </Card.Body>
    </Card>
)
};

function TeamDisplay({gameId, teamName, team, teamColor}){
    return <Card.Link href={`biletzele/new-player/${gameId}/${teamName}`}>
        <Button variant={teamColor} className="game-button">
            {`${teamName} `}
            <span className="bordered-box">{team.members.length}/10</span>
        </Button>
    </Card.Link>;
}
