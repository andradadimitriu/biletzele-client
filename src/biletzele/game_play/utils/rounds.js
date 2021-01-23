//TODO maybe transform this into a class/hook and delegate more work to it

export function getRound(game){
    return game.rounds.length > 0 && game.rounds[game.rounds.length-1];
}
