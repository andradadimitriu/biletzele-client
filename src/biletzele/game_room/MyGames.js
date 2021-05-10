import React from "react";
import GameTile from "./GameTile";
import {GAME_STATUS} from "../utils/constants";
import {getGamesByStatus} from "../service/biletzele-service";
import Loading from "../../utils_components/Loading";
import {Auth} from "aws-amplify";
import Form from 'react-bootstrap/Form';

export class MyGames extends React.Component {

  constructor(props) {
    super(props);
    this.state = { myGames: [], isLoading: true, currentUser: undefined, searchText: ""};
  }

  async componentDidMount(){
      const activeGames = await getGamesByStatus(GAME_STATUS.ACTIVE);
      const pendingGames = await getGamesByStatus(GAME_STATUS.PENDING);
      const allGamesOfInterest = activeGames.concat(pendingGames);
      //TODO might be able to get it in props
      const currentUser = await Auth.currentCredentials();
      const myGames = allGamesOfInterest.filter(game => game.creator === currentUser.identityId || game.players.ids.includes(currentUser.identityId));
      this.setState({currentUser, myGames, isLoading: false, filteredGames: myGames});
  }
  async componentDidUpdate(prevProps, prevState){
      if (prevState.searchText !== this.state.searchText) {
          if(this.state.searchText.length > 0){
              this.setState({filteredGames: this.state.myGames.filter(game => game.gameName.toLowerCase().includes(this.state.searchText.toLowerCase()))});
          }
      }

  }

  async

  render() {
      return (
      <div>
          <Form.Control style={{margin: 20,  width: '24rem'}} type="text" placeholder="Search" value={this.state.searchText} className="mr-sm-2" onChange={(event)=>this.setState({searchText: event.target.value})}
          />
        {this.state.isLoading ? <Loading/> : this.state.filteredGames.map((game, id) => <GameTile key={id} game={game} user={this.state.currentUser}/>)}
      </div>
      );
  }
}
