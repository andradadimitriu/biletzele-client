export async function addPlayerToGame(websocket, gameId, teamName, player, words) {
    return await websocket.send(JSON.stringify({ action: "addplayer", data: {
        gameId,
        teamName,
        player,
        words
    }}));
}

export async function endTurn(websocket, gameId, turnNo) {
    return await websocket.send(JSON.stringify({ action: "endturn", data: {
            gameId,
            turnNo
        }}));
}
