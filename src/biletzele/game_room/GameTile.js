import React from 'react';
import {Card} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import "./pendingGameTile.css";
import {isPlayerInGame} from "../utils/playerUtils";
import {GAME_STATUS} from "../utils/constants";
const teamColors = (id) => id % 2 === 0 ? "primary" : "info";

export default function GameTile(props) {
    return (
        <Card className="card-styling">
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
                {props.game.gameStatus === GAME_STATUS.PENDING ?
                    (!isPlayerInGame(props.game, props.user) &&
                        <>
                            <Card.Text>
                                Choose your team.
                            </Card.Text>
                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                                {Object.keys(props.game.teams).map((teamName, id) =>
                                    <TeamDisplay key={id} gameId={props.game.gameId} teamName={teamName}
                                                 team={props.game.teams[teamName]} teamColor={teamColors(id)}/>
                                )}
                            </div>
                            <div>
                                <Card.Link
                                    href={`/biletzele/new-player/${props.game.gameId}/${chooseTeam(props.game.teams)}`}>Choose team for me.</Card.Link>
                            </div>
                        </>) : <div>New players cannot join anymore. </div>}
            </Card.Body>
        </Card>
    )
};

function TeamDisplay({gameId, teamName, team, teamColor}) {
    return <Card.Link style={{paddingBottom: 10}} href={`/biletzele/new-player/${gameId}/${teamName}`}>
        <Button variant={teamColor} className="game-button">
            {`${teamName} `}
            <span className="bordered-box">{Object.keys(team.members).length}/10</span>
        </Button>
    </Card.Link>;
}

function chooseTeam(teams) {
    return Object.keys(teams).reduce((smallestTeamName, teamName) =>
            Object.keys(teams[teamName].members).length < Object.keys(teams[smallestTeamName].members).length ? teamName : smallestTeamName
        , Object.keys(teams)[0]);
}