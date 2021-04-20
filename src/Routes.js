import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NotFound from "./utils_components/NotFound";
import Login from "./login/Login";
import Signup from "./login/Signup";
import AuthenticatedRoute from "./utils_components/AuthenticatedRoute";
import UnauthenticatedRoute from "./utils_components/UnauthenticatedRoute";
import {Biletzele} from "./biletzele/game_room/Biletzele";
import PlayerEnterGameForm from "./biletzele/game_room/PlayerEnterGameForm";
import WaitingRoom from "./biletzele/game_room/WaitingRoom";
import JoinGame from "./biletzele/game_room/JoinGame";
import GamePlay from "./biletzele/game_play/GamePlay";
import DeleteGame from "./biletzele/cleanup/DeleteGame";

export default function Routes({setAppLevelGameId, websocket, refreshGameStatus}) {
  return (
    <Switch>
        <UnauthenticatedRoute exact path="/login">
          <Login />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute exact path="/signup">
          <Signup />
        </UnauthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele">
            <Biletzele/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele/join-game/:gameId">
            <JoinGame setAppLevelGameId={setAppLevelGameId}/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele/new-player/:gameId/:teamName">
            <PlayerEnterGameForm websocket={websocket}/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele/waiting-room/:gameId">
            <WaitingRoom setAppLevelGameId={setAppLevelGameId} websocket={websocket} refreshGameStatus={refreshGameStatus}/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele/game/:gameId">
            <GamePlay setAppLevelGameId={setAppLevelGameId}/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele/delete-one-game/:gameId">
            <DeleteGame/>
        </AuthenticatedRoute>
      <Route exact path="/">
          <Redirect to="/biletzele" />
      </Route>

      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}