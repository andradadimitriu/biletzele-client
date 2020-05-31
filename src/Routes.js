import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import BiletzelePathResolver from "./containers/BiletzelePathResolver";
import Notes from "./containers/Notes";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

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
          <BiletzelePathResolver />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/biletzele/:gameId/:teamName">
          <BiletzelePathResolver/>
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