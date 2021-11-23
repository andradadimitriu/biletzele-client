//TODO maybe transform this into a class/hook and delegate more work to it
import {isPlayerCurrentUser} from "../../utils/playerUtils";

export function who_sTurnToAct(teams, turn){
    const teamNames = Object.keys(teams);
    const noOfTeams = teamNames.length;
    const teamTurnCount = turn % noOfTeams;
    const playerTurnCount = Math.floor(turn/noOfTeams);
    const teamTurn = teamNames[teamTurnCount];
    const playersInTeam = teams[teamTurn].members;
    const playersIds = Object.keys(playersInTeam);
    const playerTurn = playersInTeam[playersIds[playerTurnCount % playersIds.length]];
    return {teamTurn, playerTurn};
}

export function myTurnToGuess(team, user){
    return Object.keys(team.members).some(playerId => playerId === user.identityId);
}

export function myTurnToAct(player, user){
    return isPlayerCurrentUser(player, user);
}

export function getTurn(game){
    if(game.turn && game.turnNumber === game.turn.turnNo){
        return game.turn;
    }
}
