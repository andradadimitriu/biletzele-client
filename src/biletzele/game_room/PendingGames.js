import React from "react";
import GameTile from "./GameTile";
import {GAME_STATUS} from "../utils/constants";
import {getGamesByStatus} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";
import {Auth} from "aws-amplify";
import Form from 'react-bootstrap/Form';

export class PendingGames extends React.Component {

  constructor(props) {
    super(props);
    this.state = { pendingGames: [], isLoading: true, currentUser: undefined, searchText: ""};
  }

  async componentDidMount(){
      const pendingGames = await getGamesByStatus(GAME_STATUS.PENDING);
      //TODO might be able to get it in props
      const currentUser = await Auth.currentCredentials();
      this.setState({currentUser, pendingGames, isLoading: false, filteredGames: pendingGames});
  }
  async componentDidUpdate(prevProps, prevState){
      if (prevState.searchText !== this.state.searchText) {
          if(this.state.searchText.length > 0){
              this.setState({filteredGames: this.state.pendingGames.filter(game => game.gameName.toLowerCase().includes(this.state.searchText.toLowerCase()))});
          }
      }

  }

  render() {
      return (
      <div className="horizontalflex">
          <Form.Control type="text" placeholder="Search" value={this.state.searchText} className="mr-sm-2 card-styling" onChange={(event)=>this.setState({searchText: event.target.value})}
          />
        {this.state.isLoading ? <Loading/> : this.state.filteredGames.map((game, id) => <GameTile key={id} game={game} user={this.state.currentUser}/>)}
      </div>
      );
  }
}
