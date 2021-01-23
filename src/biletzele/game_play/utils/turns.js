//TODO maybe transform this into a class/hook and delegate more work to it
export function who_sTurnToAct(teams, turn){
    const teamNames = Object.keys(teams);
    const noOfTeams = teamNames.length;
    const teamTurnCount = turn % noOfTeams;
    const playerTurnCount = Math.floor(turn/noOfTeams);
    const teamTurn = teamNames[teamTurnCount];
    const playerTurn = teams[teamTurn].members[playerTurnCount];
    return {teamTurn, playerTurn};
}

export function myTurnToGuess(team, userId){
   return team.members.some(player => player.playerId === userId);
}


export function myTurnToAct(player, user){
    return player.playerId === user.identityId;
}

export function getTurn(game){
    if(game.turn && game.turnNumber === game.turn.turnNo){
        return game.turn;
    }
}
