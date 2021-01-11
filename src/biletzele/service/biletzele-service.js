import {API} from "aws-amplify";

export async function getGame(gameId) {
    return await API.get("notes", `/biletzele/getgame/${gameId}`);
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
    return await API.post("notes", `/biletzele/startgame/${gameId}`);
}

export async function endRound(gameId, roundNumber) {
    return await API.post("notes", `/biletzele/endround/${gameId}`, {
        body: {
            roundNumber
        }});
}

export async function newRound(gameId, round, wordsLeft) {
    return await API.post("notes", `/biletzele/newround/${gameId}`, {
        body: {
            roundNo: round.roundNo,
            wordsLeft,
            changedBody: true
        }});
}

export async function updateRound(gameId, round, wordsLeft) {
    return await API.post("notes", `/biletzele/updateround/${gameId}`, {
        body: {
            ...round,
            wordsLeft
        }});
}
