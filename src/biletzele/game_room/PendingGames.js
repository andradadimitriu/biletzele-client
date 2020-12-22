import React from "react";
import GameTile from "./GameTile";
import {API} from "aws-amplify";
import {GAME_STATUSES} from "../utils/statuses";

export class PendingGames extends React.Component {

  constructor(props) {
    super(props);
    this.state = { pendingGames: [] };
  }

  async componentWillMount(){
    const pendingGames = await API.get("notes", `/biletzele/getgames/${GAME_STATUSES.PENDING}`);
    this.setState({pendingGames});
  }

  render() {
      return (
      <div>
        {this.state.pendingGames.map(game => <GameTile game={game}/>)}
      </div>
      );
  }
}
