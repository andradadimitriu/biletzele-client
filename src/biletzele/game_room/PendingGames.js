import React from "react";
import GameTile from "./GameTile";
import {GAME_STATUS} from "../utils/constants";
import {getGamesByStatus} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";
import {Auth} from "aws-amplify";

export class PendingGames extends React.Component {

  constructor(props) {
    super(props);
    this.state = { pendingGames: [], isLoading: true, currentUser: undefined};
  }

  async componentDidMount(){
      const pendingGames = await getGamesByStatus(GAME_STATUS.PENDING);
      //TODO might be able to get it in props
      const currentUser = await Auth.currentCredentials();
      this.setState({currentUser, pendingGames, isLoading: false});
  }

  render() {
      return (
      <div>
        {this.state.isLoading ? <Loading/> : this.state.pendingGames.map((game, id) => <GameTile key={id} game={game} user={this.state.currentUser}/>)}
      </div>
      );
  }
}
