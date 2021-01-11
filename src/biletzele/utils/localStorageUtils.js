import moment from "moment";

export const LOCAL_STORAGE_KEY = "biletzeleGame";

export function getWordsLeft(game, round){
    const localStorageItem = getLocalStorageItem(game);
    return (localStorageItem && localStorageItem.wordsLeft) || round.wordsLeft;
}

export function getStartTime(game){
    const localStorageItem = getLocalStorageItem(game);
    return (localStorageItem && moment.utc(localStorageItem.startTime)) || moment.utc();
}

export function addStartTimeToStorage(game, startTime){
    let localStorageItem = getLocalStorageItem(game);
    if(localStorageItem){
        if(localStorageItem.startTime) return;
        localStorageItem.startTime = startTime.toString();
    }
    else {
        localStorageItem = {startTime: startTime.toString()};
    }
    setLocalStorageItem(game, localStorageItem);
}

export function updateWordsLeftToStorage(game, wordsLeft){
    let localStorageItem = getLocalStorageItem(game);
    if(localStorageItem){
        localStorageItem.wordsLeft = wordsLeft;
    }
    else {
        localStorageItem = {wordsLeft: wordsLeft}
    }
    setLocalStorageItem(game, localStorageItem);
}

export function removeFromLocalStorage(){
    localStorage.removeItem(LOCAL_STORAGE_KEY);
}

function getLocalStorageItem(game){
    const localStorageItemString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localStorageItem = localStorageItemString ? JSON.parse(localStorageItemString) : {};
    return localStorageItem[game.gameId] && localStorageItem[game.gameId][game.turnNumber];
}
function setLocalStorageItem(game, item){
    const localStorageItem = {[game.gameId]:{[game.turnNumber]: item}}
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageItem));
}
