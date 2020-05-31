import React from 'react';
import {Card} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import "./PendingGameTile.css";

export default function PendingGameTile (props)  {
return (
    <Card className="margin" style={{ width: '18rem'}}>
      <Card.Body>
        <Row>
          <Col xs={6}><Card.Title style={{paddingRight: 0}}>{props.game.gameName}</Card.Title></Col>
          <Col xs={6} style={{paddingRight: 0}}><Button variant="danger" className="game-button"><Card.Link href="#">Start Game</Card.Link></Button></Col>
       </Row>

        <Card.Subtitle className="mb-2 text-muted">Pending</Card.Subtitle>
        <div>
          <span className="bordered-box">{props.game.words}</span> words added in the hat.
        </div>
        <br/>
        <br/>
        <Card.Text>
          Choose your team.
        </Card.Text>
        <div>
          <Card.Link href={`biletzele/${props.game.gameId}/${props.game.team1.name}`}>
            <Button variant="primary" className="game-button">
              {props.game.team1.name}
            </Button>
          </Card.Link>
          <Card.Link href={`biletzele/${props.game.gameId}/${props.game.team2.name}`}>
            <Button variant="info" className="game-button">{props.game.team2.name}</Button>
          </Card.Link>
        </div>
        <div>
          <Card.Link href="#!">Randomly allocate me.</Card.Link>
        </div>
      </Card.Body>
    </Card>
)
};
