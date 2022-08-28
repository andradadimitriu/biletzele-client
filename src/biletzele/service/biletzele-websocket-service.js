import websocket from './reconnecting-websocket';
import {getTheOtherTeam} from "../utils/playerUtils";

export async function addPlayerToGame(gameId, teamName, player, words) {
    return await websocket.send(JSON.stringify({
        action: "addplayer", data: {
            gameId,
            teamName,
            player,
            words,
            ready: false
        }
    }));
}

export async function switchTeam(game, oldTeamName, playerId) {
    const data={
        gameId: game.gameId, oldTeamName, newTeamName: getTheOtherTeam(game,oldTeamName), playerId
    };

    return await websocket.send(JSON.stringify({
        action: "switchteam", data
    }));
}

export async function playerReady(gameId, {teamName, playerId, ready}) {
    return await websocket.send(JSON.stringify({
        action: "playerready", data: {
            gameId,
            playerId,
            teamName,
            ready,
        }
    }));
}

export async function endTurn(gameId, turnNo) {
    return await websocket.send(JSON.stringify({
        action: "endturn", data: {
            gameId,
            turnNo
        }
    }));
}

export async function newRound(gameId, roundNo) {
    return await websocket.send(JSON.stringify({
        action: "newround", data: {
            gameId,
            roundNo
        }
    }));
}

export async function endRound(gameId, roundNo, turnNo) {
    return await websocket.send(JSON.stringify({
        action: "endround", data: {
            gameId,
            roundNo,
            turnNo
        }
    }));
}

export async function endGame(gameId, roundNo, turnNo) {
    return await websocket.send(JSON.stringify({
        action: "endgame", data: {
            gameId,
            roundNo,
            turnNo
        }
    }));
}

export async function nextWordToGuess(gameId, turnNo, roundNo, teamTurn, oldWordIndex, newWordIndex, wordGuessed) {
    return await websocket.send(JSON.stringify({
        action: "wordtoguess", data: {
            gameId, roundNo, turnNo, oldWordIndex, newWordIndex, teamTurn, wordGuessed
        }
    }));
}