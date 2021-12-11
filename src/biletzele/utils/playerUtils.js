export function isPlayerInGame(game, user) {
    return game.players.ids.includes(user.identityId);
}

export function isPlayerCurrentUser(player, user) {
    return player.playerId === user.identityId;
}

export function getTheOtherTeam(game, teamName) {
    return Object.keys(game.teams).find(team => team !== teamName);
}