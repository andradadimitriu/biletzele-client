import React from "react";
import PendingGameTile from "./PendingGameTile";

const game1 = {
    gameName: "First Game",
    gameCreator: {id: "", playerName: ""},
    words: ["kmjnjnjn"],
    gameId: 1,
    teams: [{
        name: "Fetele",
        members: [{id :"andr2@example.com", playerName:"Andr43"}],
        score: 12,
    }, {
        name: "Baietii",
        members: [],
        score: 0
    }],
    turn: 0,
    no_rounds: 4,
    rounds: [{
        round_no: 1,
        status: "in progress",
        words_left: ["dfdgfdfdg"],
        score: [{team: "Fetele", score: 12}, {team: "Baietii", score: 0}]
    }]
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
