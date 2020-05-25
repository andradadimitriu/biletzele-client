import React from 'react';
import {Panel} from 'react-bootstrap';

export default function PendingGameTile (props)  {
return (
  <Panel>
    <Panel.Body>
        <h1>{props.game.gameName}</h1>
            <p>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </p>
            <a href="#">{props.game.team1Name}</a>
            <a href="#">{props.game.team2Name}</a>
        <div>
          <a href="#!">Randomly allocate me.</a>
        </div>
    </Panel.Body>
  </Panel>
)
};
