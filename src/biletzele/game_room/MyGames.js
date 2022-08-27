import React, {useCallback} from "react";
import {GAME_STATUS} from "../utils/constants";
import {getGamesByStatus} from "../service/biletzele-service";
import {Auth} from "aws-amplify";
import GamesList from "./GamesList";

export default function MyGames() {
    const getGames = useCallback(  async () => {
        const activeGames = await getGamesByStatus(GAME_STATUS.ACTIVE);
        const pendingGames = await getGamesByStatus(GAME_STATUS.PENDING);
        const allGamesOfInterest = activeGames.concat(pendingGames);
        //TODO get current user in props or from context
        const currentUser = await Auth.currentCredentials();
        return allGamesOfInterest.filter(game => game.creator === currentUser.identityId || game.players.ids.includes(currentUser.identityId));

    }, []);
    return <GamesList getGames={getGames}/>;
}
