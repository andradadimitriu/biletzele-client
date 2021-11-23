export const GAME_STATUS = {
    PENDING: "Pending",
    ACTIVE: "Active",
    ENDED: "Ended"
};
export const MESSAGE_TYPE = {
    NEXT_WORD: "NEXT_WORD",
    PLAYER_READY: "PLAYER_READY",
    NEW_PLAYER: "NEW_PLAYER",
    END_OF_TURN: "END_OF_TURN",
    END_OF_ROUND: "END_OF_ROUND",
    END_OF_GAME: "END_OF_GAME",
    NEW_ROUND: "NEW_ROUND"
};

export const GAME_PLAY_REFRESH_MESSAGES = [MESSAGE_TYPE.END_OF_TURN,
    MESSAGE_TYPE.END_OF_ROUND,
    MESSAGE_TYPE.END_OF_GAME,
    MESSAGE_TYPE.NEW_ROUND];

export const READINESS={
    READY: "Ready",
    NOT_READY: "Wait"
}
export const STATUS_COLOR = {
    Ready: "#00b300",
    Wait: "#ffc107"
};

export const ROUNDS = [{
    type: "DESCRIBE",
    name: "Describe the word",
    description: "Describe the word to be guessed, without saying the word or any derivatives of the word.",
},
    {
        type: "MIME",
        name: "Mime the word",
        description: "Use your body and face to make people think of the word to be guessed. Do not use your voice, do not point at existing objects! ",
    },
    {
        type: "WORD",
        name: "One word",
        description: "Say only one word that will help people think of the word to be guessed. Do not use any derivatives of the word to be guessed. Once you said one word, you can't say any others until the word is guessed or the time has passed",
    },
    {
        type: "SOUNDS",
        name: "Sounds",
        description: "Make sounds, hum a little song. Do not speak any words and do not use miming as a means of expression. Better yet, close your camera!",
    },];

export const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: 10
    },
    alert: {
        color: "red"
    },
    waiting: {
        color: "grey"
    }
};