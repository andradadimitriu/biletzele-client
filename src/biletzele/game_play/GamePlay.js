import React, {useEffect, useState} from "react";
import {GAME_STATUSES} from "../utils/statuses";
import {useParams} from "react-router-dom";
import {Auth} from "aws-amplify";
import {getGame} from "../service/biletzele-service";
import {myTurnToGuess} from "../utils/turns";

export default function GamePlay(props) {
  const [game, setGame] = useState(undefined);
  const [user, setUser] = useState(undefined);
  let { gameId } = useParams();

  useEffect(() => {
    (async function updateGameAndUser(){
      const currentUser = await Auth.currentCredentials();
      setUser(currentUser);
      //TODO would it be a good idea to get it from props when possible?
      const game = await getGame(gameId || props.gameId);
      setGame(game);
    })();
  }, [gameId]);

  return user && game && game.gameStatus === GAME_STATUSES.ACTIVE &&
      myTurnToGuess(user.identityId, game.teams, game.turn);
}
