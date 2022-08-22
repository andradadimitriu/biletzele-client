import React, {useEffect, useState} from "react";
import Row from 'react-bootstrap/Row';
import {useHistory, useParams} from "react-router-dom";
import {Auth} from "aws-amplify";
import Button from "react-bootstrap/Button";
import {getGame, startGame} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";
import {READINESS, STATUS_COLOR, GAME_STATUS, MESSAGE_TYPE} from "../utils/constants";
import "../utils/utils.css";
import "./WaitingRoom.css";
import LoaderButton from "../../utils_components/LoaderButton";
import {isPlayerCurrentUser, isPlayerInGame} from "../utils/playerUtils";
import CouldNotFindGame from "../utils/CouldNotFindGame";
import websocket from '../service/reconnecting-websocket';
import {switchTeam, playerReady} from "../service/biletzele-websocket-service";
import Switch from "react-switch";
import {Card} from "react-bootstrap";

const MIN_PLAYERS_PER_TEAM = 2;

const WaitingRoom = ({setAppLevelGameId}) => {
    const history = useHistory();
    let {gameId} = useParams();
    const joinGameLink = `${window.location.origin}/biletzele/join-game/${gameId}`
    const [game, setGame] = useState(undefined);
    const [playerReadiness, setPlayerReadiness] = useState(undefined);
    const [user, setUser] = useState(undefined);
    const [canStartGame, setCanStartGame] = useState(false);
    const [startsOrJoinsGame, setStartsOrJoinsGame] = useState(undefined);

    function getCreatorPlayerName() {
        const playerIdIndex = game.players.ids.findIndex(player => player === game.creator);
        if (playerIdIndex === -1) {
            return "The creator of this game did not join.";
        }
        return game.players.playerNames[playerIdIndex];
    }

    async function startOrJoinGame() {
        if (game.gameStatus === GAME_STATUS.PENDING) {
            setStartsOrJoinsGame(true);
            await startGame(gameId);
            setStartsOrJoinsGame(false);
        }
        history.push(`/biletzele/game/${gameId}`);
    }

    useEffect(() => {
        (async function () {
            setAppLevelGameId(gameId);
        })();
    }, [setAppLevelGameId, gameId]);

    useEffect(() => {
        (async function announcePlayerReadiness() {
            playerReadiness && await playerReady(gameId, playerReadiness)
        })();
    }, [playerReadiness, gameId]);

    useEffect(() => {
        function handleMessageOnWaitingRoom(message) {
            const data = JSON.parse(message);
            console.log(`message received: ${message}`);
            switch (data.type) {
                case MESSAGE_TYPE.NEW_PLAYER:
                case MESSAGE_TYPE.PLAYER_SWITCHED_TEAM:
                case MESSAGE_TYPE.PLAYER_READY:
                    setGame(data.game);
                    break;
                default:
            }
        }

        handleMessageOnWaitingRoom.originalName = "handleMessageOnWaitingRoom";
        websocket.on(handleMessageOnWaitingRoom);
        return () => websocket.off(handleMessageOnWaitingRoom);

    }, []);

    useEffect(() => {
        (async function updateUser() {
            const currentUser = await Auth.currentCredentials();
            setUser(currentUser);
        })();
    }, []);

    useEffect(() => {
        (async function updateGame() {
            //TODO would it be a good idea to get it from props when possible?
            const game = await getGame(gameId);
            setGame(game);
        })();
    }, [gameId]);

    useEffect(() => {
        (async function updateCanStartGame() {
            function canUserStartGame() {
                if (!user || !game || game.gameNotFound) {
                    return false;
                }
                const pending = game.gameStatus === GAME_STATUS.PENDING;
                const active = game.gameStatus === GAME_STATUS.ACTIVE;
                const enoughUsers = Object.values(game.teams).every(team => Object.keys(team.members).length >= MIN_PLAYERS_PER_TEAM);
                const allReady = Object.values(game.teams).every(team => Object.values(team.members).every(member => member.ready === true));
                return (pending && enoughUsers && allReady) || active;
            }

            setCanStartGame(canUserStartGame());
        })();
    }, [game, user]);

    function Status({player, user, teamName}) {
        const status = player.ready ? READINESS.READY : READINESS.NOT_READY;
        return <div className="centered-content">{isPlayerCurrentUser(player, user) ?
            <Switch checked={player.ready || false}
                    disabled={game.gameStatus !== GAME_STATUS.PENDING}
                    offColor={STATUS_COLOR[READINESS.NOT_READY]}
                    onColor={STATUS_COLOR[READINESS.READY]}
                    width={player.ready ? 92 : 75}
                    checkedIcon={readySwitch(READINESS.READY)}
                    uncheckedIcon={readySwitch(READINESS.NOT_READY)}
                    onChange={() => setPlayerReadiness({
                        playerId: player.playerId,
                        teamName,
                        ready: !player.ready
                    })}/> : <Card style={{width: 100, backgroundColor: STATUS_COLOR[status]}} className="text-center">

                <Card.Body style={{padding: 0}}>
                    <Card.Text style={{color: "white", fontWeight: "bold"}}>{status}</Card.Text>
                </Card.Body>
            </Card>
        }
        </div>
    }

    function TeamTable({teamName, team, user}) {
        return <div style={{flex: "auto", padding: 5, minWidth: "50%"}}>
            <table className="table room">
                <thead className="thead-dark">
                <tr>
                    <th scope="col" colSpan={2} style={{backgroundColor: "pink"}}>{teamName}</th>
                </tr>
                <tr>
                    <th scope="col">Player</th>
                    <th scope="col">Status</th>
                </tr>
                </thead>
                <tbody>
                {
                    team && Object.values(team.members).map((player, id) => <tr key={id}>
                        <td>
                            <div className="text-center">
                                <span style={{marginRight: 10}}>{player.playerName}</span>
                                {canDoChanges(user, player, game) &&
                                <Button
                                    onClick={() => switchTeam(game, teamName, user.identityId)}
                                    className="changing-button" variant="warning">switch team</Button>}
                            </div>
                        </td>
                        <td>
                            <Status player={player} user={user} teamName={teamName}/>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>;
    }

    return (
        <div style={{margin: 10}}>
            {game ?
                (game.gameNotFound ? <CouldNotFindGame/> :
                        <div>
                            <div style={{margin: 20}}>
                                <Row className="centered-content"><strong>Game link</strong></Row>
                                <Row className="centered-content">
                                    <span className="center-text-vertically">{joinGameLink}</span>
                                    <Button variant="light" style={{marginLeft: 5}} onClick={() => {
                                        navigator.clipboard.writeText(joinGameLink)
                                    }}>Copy</Button>
                                </Row>
                            </div>
                            <Row style={{margin: 10}}>Creator: {getCreatorPlayerName()}</Row>

                            <div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
                                {
                                    Object.keys(game.teams).map((teamName, id) =>
                                        <TeamTable key={id} teamName={teamName} team={game.teams[teamName]}
                                                   user={user}/>)
                                }
                            </div>
                            <div className="centered-content">
                                {
                                    game.gameStatus ? (isPlayerInGame(game, user) ?

                                        <LoaderButton variant={canStartGame ? "danger" : "outline-secondary"}
                                                      className="game-button"
                                                      disabled={!canStartGame}
                                                      isLoading={startsOrJoinsGame}
                                                      onClick={() => startOrJoinGame()}
                                        >
                                            {game.gameStatus === GAME_STATUS.PENDING ?
                                                "Start game" :
                                                "Enter game"
                                            }
                                        </LoaderButton> :
                                        "User not registered in game") :
                                        "Game has ended"
                                }
                            </div>
                        </div>
                )
                : <Loading className="margin"/>}
        </div>
    );
}
export default WaitingRoom;

function readySwitch(readiness) {
    return <div style={{
        ...(readiness === READINESS.READY ? {paddingLeft: 10} : {paddingRight: 20}),
        color: "#fff",
        fontWeight: "bold"
    }}>{readiness}</div>
}

function canDoChanges(user, player, game) {
    return isPlayerCurrentUser(player, user) && game.gameStatus === GAME_STATUS.PENDING;
}