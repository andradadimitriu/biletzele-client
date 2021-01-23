import React, {useEffect, useState} from "react";
import GameTile from "./GameTile";
import {useParams} from "react-router-dom";
import {getGame} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";


export default function JoinGame() {
    let { gameId } = useParams();
    const [game, setGame] = useState(undefined);

    useEffect(() => {
        (async function () {
            const game = await getGame(gameId);
            setGame(game);
        })();
    });

  return game ? <GameTile game={game}/> : <Loading/>;
}
