import {API} from "aws-amplify";
import moment from "moment";

export async function getGame(gameId) {
    return await API.get("notes", `/biletzele/getgame/${gameId}`);
}

export async function getGamesByStatus(status){
    return await API.get("notes", `/biletzele/getgames/${status}`);
}

export async function createGame(gameName, team1Name, team2Name) {
    return await API.post("notes", "/biletzele/create", {
        body: {
            gameName,
            team1Name,
            team2Name
        }});
}

export async function startGame(gameId) {
    return await API.post("notes", `/biletzele/startgame/${gameId}`);
}

export async function newTurn(gameId, turnNo, startTime, wordIndex) {
    const turn = await API.post("notes", `/biletzele/newturn/${gameId}`, {
        body: {
           turnNo,
            startTime: startTime.toISOString(),
            wordIndex
        }});
    turn.startTime = moment(turn.startTime);
    return turn;
}

export async function nextWordToGuess(gameId, turnNo, roundNo, teamTurn, oldWordIndex, newWordIndex) {
    return await API.post("notes", `/biletzele/wordtoguess/${gameId}`, {
        body: {
            roundNo, turnNo, oldWordIndex, newWordIndex, teamTurn
        }});
}

export async function deleteGame(gameId) {
    return await API.post("notes", `/biletzele/deleteone/${gameId}`);
}
