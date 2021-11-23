export function isPlayerInGame(game, user){
    return game.players.ids.includes(user.identityId);
}
export function isPlayerCurrentUser(player, user){
    return player.playerId === user.identityId;
}