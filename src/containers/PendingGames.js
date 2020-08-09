import React, { useState } from "react";
import PendingGameTile from "./PendingGameTile";

const game1 = {
    gameName: "First Game",
    words: 10,
    gameId: 1,
    team1: {
      name: "Fetele",
      members: ["andr2"]
    },
    team2: {
      name: "Baietii",
      members: ["andr1"]
    }
};

export class PendingGames extends React.Component {

  constructor(props) {
    super(props);
    this.state = { pendingGames: [] };
  }

  componentWillMount(){

    this.setState({pendingGames: JSON.parse(window.localStorage.getItem("games"))});
  }

  render() {
      return (
      <div>
        {this.state.pendingGames.map(game => <PendingGameTile game={game}/>)}
      </div>
      );
  }
}
