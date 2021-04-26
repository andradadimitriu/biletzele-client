export const GAME_STATUS = {
    PENDING: "Pending",
    ACTIVE: "Active",
    ENDED: "Ended"
};
export const MESSAGE_TYPE = {
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
