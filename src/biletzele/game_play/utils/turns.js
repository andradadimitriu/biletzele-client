//TODO maybe transform this into a class/hook and delegate more work to it
export function who_sTurnToAct(teams, turn){
    const teamNames = Object.keys(teams);
    const noOfTeams = teamNames.length;
    const teamTurnCount = turn % noOfTeams;
    const playerTurnCount = Math.floor(turn/noOfTeams);
    const teamTurn = teamNames[teamTurnCount];
    const playersInTeam = teams[teamTurn].members;
    const playerTurn = playersInTeam[playerTurnCount % playersInTeam.length];
    return {teamTurn, playerTurn};
}

export function myTurnToGuess(team, user){
    return team.members.some(player => player.playerId === user.identityId);
}

export function myTurnToAct(player, user){
    return player.playerId === user.identityId;
}

export function getTurn(game){
    if(game.turn && game.turnNumber === game.turn.turnNo){
        return game.turn;
    }
}
