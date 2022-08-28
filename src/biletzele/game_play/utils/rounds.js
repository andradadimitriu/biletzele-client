import {GAME_STATUS} from "../../utils/constants";

export function getRound(game){
    const activeRound = getActiveRound(game);
    if(activeRound){
       return activeRound;
    }
    const lastPlayedRoundIndex = game.rounds.map(round => round.roundStatus).lastIndexOf(GAME_STATUS.ENDED);
    return game.rounds[lastPlayedRoundIndex];
}

function getActiveRound(game){
    return game.rounds.length > 0 && game.rounds.find(round => round.roundStatus === GAME_STATUS.ACTIVE);
}
