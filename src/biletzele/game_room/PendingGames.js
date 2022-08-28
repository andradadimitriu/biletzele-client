import React, {useCallback} from "react";
import GamesList from "./GamesList";
import {getGamesByStatus} from "../service/biletzele-service";
import {GAME_STATUS} from "../utils/constants";

export default function PendingGames(){
    const getGames = useCallback(  async () => await getGamesByStatus(GAME_STATUS.PENDING), []);
    return <GamesList getGames={getGames}/>;
}
