
export function getGames(){
    return JSON.parse(window.localStorage.getItem("games"));
}
export function getGame(gameId){
    //TODO change to getGame which will call to api query; remove getGames
    const games = getGames();
    return games.find(game => game.gameId === gameId);
}
