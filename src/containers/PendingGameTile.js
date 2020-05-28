import React from 'react';
import {Card} from 'react-bootstrap';

export default function PendingGameTile (props)  {
return (
    <Card className="margin" style={{ width: '18rem'}}>
      <Card.Body>
        <Card.Title>{props.game.gameName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Pending</Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the bulk of
          the card's content.
        </Card.Text>
        <Card.Link href="#">{props.game.team1Name}</Card.Link>
        <Card.Link href="#">{props.game.team2Name}</Card.Link>
            <div>
              <Card.Link href="#!">Randomly allocate me.</Card.Link>
            </div>
      </Card.Body>
    </Card>
)
};
