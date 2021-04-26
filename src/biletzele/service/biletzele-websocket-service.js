import websocket from './reconnecting-websocket';

export async function addPlayerToGame(gameId, teamName, player, words) {
    return await websocket.send(JSON.stringify({ action: "addplayer", data: {
        gameId,
        teamName,
        player,
        words
    }}));
}

export async function endTurn(gameId, turnNo) {
    return await websocket.send(JSON.stringify({ action: "endturn", data: {
            gameId,
            turnNo
        }}));
}

export async function newRound(gameId, roundNo) {
    return await websocket.send(JSON.stringify({ action: "newround", data: {
            gameId,
            roundNo
        }}));
}

export async function endRound(gameId, roundNo, turnNo) {
    return await websocket.send(JSON.stringify({ action: "endround", data: {
            gameId,
            roundNo,
            turnNo
        }}));
}

export async function endGame(gameId, roundNo, turnNo) {
    return await websocket.send(JSON.stringify({ action: "endgame", data: {
            gameId,
            roundNo,
            turnNo
        }}));
}