import {API} from "aws-amplify";
import moment from "moment"
import config from '../../config';

const API_NAME = config.apiGateway.API_NAME;

export async function getGame(gameId) {
    return await API.get(API_NAME, `/biletzele/getgame/${gameId}`);
}

export async function getGamesByStatus(status){
    return await API.get(API_NAME, `/biletzele/getgames/${status}`);
}

export async function createGame(gameName, team1Name, team2Name) {
    return await API.post(API_NAME, "/biletzele/create", {
        body: {
            gameName,
            team1Name,
            team2Name
        }});
}

export async function startGame(gameId) {
    return await API.post(API_NAME, `/biletzele/startgame/${gameId}`);
}

export async function newTurn(gameId, turnNo, startTime, wordIndex) {
    const turn = await API.post(API_NAME, `/biletzele/newturn/${gameId}`, {
        body: {
           turnNo,
            startTime: startTime.toISOString(),
            wordIndex
        }});
    turn.startTime = moment(turn.startTime);
    return turn;
}

export async function nextWordToGuess(gameId, turnNo, roundNo, teamTurn, oldWordIndex, newWordIndex) {
    return await API.post(API_NAME, `/biletzele/wordtoguess/${gameId}`, {
        body: {
            roundNo, turnNo, oldWordIndex, newWordIndex, teamTurn
        }});
}

export async function deleteGame(gameId) {
    return await API.post(API_NAME, `/biletzele/deleteone/${gameId}`);
}
