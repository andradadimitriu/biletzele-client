//TODO maybe transform this into a class/hook and delegate more work to it
import { ROUND_STATUSES} from "../../utils/constants";

export function getRound(game){
    const newRound = {
        wordsLeft: game.words,
        roundNo: 1,
        newRound: true
    };
    const lastRound = game.rounds.length > 0 && game.rounds[game.rounds.length-1]
    return lastRound ?
        (lastRound.roundStatus === ROUND_STATUSES.ACTIVE ?
            lastRound:
            (lastRound.roundNo < game.noRounds ?
                {
                    ...newRound,
                    roundNo: lastRound.roundNo + 1
                }: undefined
            )): newRound
}
