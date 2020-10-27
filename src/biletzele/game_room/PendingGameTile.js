import React from 'react';
import {Card} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import "./PendingGameTile.css";
const teamColors = (id) => id % 2 === 0 ? "primary" : "info";

export default function PendingGameTile (props)  {
return (
    <Card className="margin" style={{ width: '20rem'}}>
      <Card.Body>
        <Row>
          <Col xs={8}><Card.Title style={{paddingRight: 0}}>{props.game.gameName}</Card.Title></Col>
          <Col xs={4} style={{paddingRight: 0}}><Button variant="danger" className="game-button"><Card.Link href="#">Join</Card.Link></Button></Col>
       </Row>

        <Card.Subtitle className="mb-2 text-muted">Pending</Card.Subtitle>
        <div>
          <span className="bordered-box">{props.game.words.length}</span> words added in the hat.
        </div>
        <br/>
        <br/>
        <Card.Text>
          Choose your team.
        </Card.Text>
        <div>
            {props.game.teams.map((team, id) =>
                <TeamDisplay gameId={props.game.gameId} team={team} teamColor={teamColors(id)}/>
                )}
        </div>
        <div>
          <Card.Link href="#!">Randomly allocate me.</Card.Link>
        </div>
      </Card.Body>
    </Card>
)
};

function TeamDisplay({gameId, team, teamColor}){
    return <Card.Link href={`biletzele/new-player/${gameId}/${team.name}`}>
        <Button variant={teamColor} className="game-button">
            {`${team.name} `}
            <span className="bordered-box">{team.members.length}/10</span>
        </Button>
    </Card.Link>;
}
