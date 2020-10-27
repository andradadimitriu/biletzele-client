import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./notesapp/containers/Home";
import NotFound from "./utils_components/NotFound";
import Login from "./login/Login";
import Signup from "./login/Signup";
import NewNote from "./notesapp/containers/NewNote";
import Notes from "./notesapp/containers/Notes";
import AuthenticatedRoute from "./utils_components/AuthenticatedRoute";
import UnauthenticatedRoute from "./utils_components/UnauthenticatedRoute";
import {Biletzele} from "./biletzele/game_room/Biletzele";
import PlayerEnterGameForm from "./biletzele/game_room/PlayerEnterGameForm";
import WaitingRoom from "./biletzele/game_room/WaitingRoom";

export default function Routes() {
  return (
    <Switch>
        <UnauthenticatedRoute exact path="/login">
          <Login />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute exact path="/signup">
          <Signup />
        </UnauthenticatedRoute>
        <AuthenticatedRoute exact path="/notes/new">
          <NewNote />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele">
            <Biletzele/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele/new-player/:gameId/:teamName">
            <PlayerEnterGameForm/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/waiting-room/:gameId">
            <WaitingRoom/>
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/notes/:id">
          <Notes />
        </AuthenticatedRoute>
      <Route exact path="/">
        <Home />
      </Route>

      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}