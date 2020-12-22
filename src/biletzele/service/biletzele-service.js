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
