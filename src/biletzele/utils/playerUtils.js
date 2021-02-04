export function isPlayerInGame(game, user){
    return game.players.ids.includes(user.identityId);
}