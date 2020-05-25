import React, { useState } from "react";
import PendingGameTile from "./PendingGameTile";

const game1 = {
    gameName: "First Game",
    team1Name: "Fetele",
    team2Name: "Baietii"
};

export class PendingGames extends React.Component {

  constructor(props) {
    super(props);
    this.state = { pendingGames: [] };
  }

  componentWillMount(){

    this.setState({pendingGames: [game1]});
  }

  render() {
      return (
      <div>
        {this.state.pendingGames.map(game => <PendingGameTile game={game}/>)}
      </div>
      );
  }
}
