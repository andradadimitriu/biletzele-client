import React, {useEffect, useState} from "react";
import GameTile from "./GameTile";
import {useParams} from "react-router-dom";
import {getGame} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";
import {Auth} from "aws-amplify";
import CouldNotFindGame from "../utils/CouldNotFindGame";


export default function JoinGame() {
    let { gameId } = useParams();
    const [game, setGame] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        (async function () {
            const game = await getGame(gameId);
            const user = await Auth.currentCredentials();
            setCurrentUser(user);
            setGame(game);
        })();
    },[currentUser, gameId]);

  return game && currentUser ? (game.gameExists ? <GameTile game={game} user={currentUser}/> : <CouldNotFindGame/>) : <Loading/>;
}
