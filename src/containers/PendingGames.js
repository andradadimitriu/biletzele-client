import React from "react";
import PendingGameTile from "./PendingGameTile";

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
