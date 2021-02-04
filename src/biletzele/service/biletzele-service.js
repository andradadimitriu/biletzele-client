import {API} from "aws-amplify";
import moment from "moment";

export async function getGame(gameId) {
    return await API.get("notes", `/biletzele/getgame/${gameId}`);
}

export async function getGamesByStatus(status){
    return await API.get("notes", `/biletzele/getgames/${status}`);
}

export async function addPlayerToGame(gameId, teamName, player, words) {
    return await API.post("notes", `/biletzele/addplayer`, {
        body: {
            gameId,
            teamName,
            player,
            words
        }
    });
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
    //TODO get startgame to call new round function
    return await API.post("notes", `/biletzele/startgame/${gameId}`);
}

export async function newRound(gameId, roundNo) {
    return await API.post("notes", `/biletzele/newround/${gameId}`, {
        body: {
            roundNo
        }});
}

export async function endRound(gameId, roundNo, turnNo) {
    return await API.post("notes", `/biletzele/endround/${gameId}`, {
        body: {
            roundNo,
            turnNo
        }});
}

export async function endGame(gameId, roundNo, turnNo) {
    return await API.post("notes", `/biletzele/endgame/${gameId}`, {
        body: {
            roundNo,
            turnNo
        }});
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

export async function endTurn(gameId, turnNo) {
    return await API.post("notes", `/biletzele/endturn/${gameId}`, {
        body: {
            turnNo
        }});
}

export async function nextWordToGuess(gameId, turnNo, roundNo, teamTurn, oldWordIndex, newWordIndex) {
    return await API.post("notes", `/biletzele/wordtoguess/${gameId}`, {
        body: {
            roundNo, turnNo, oldWordIndex, newWordIndex, teamTurn
        }});
}
