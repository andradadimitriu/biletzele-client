import React from "react";
import {Row, Button} from "react-bootstrap";
import {newRound} from "../service/biletzele-websocket-service";
import {GAME_STATUS} from "../utils/constants";

export default function RoundRest(props) {
  async function startRound(){
      try {
          await newRound(props.game.gameId, props.round.roundNo + 1);
      }
      catch(e) {
          if (e.response.status !== 520) {
              throw e;
          }
      }
      // props.reloadGame();
  }
  return <div>
      {props.round.roundNo === props.game.noRounds ?
          <div style={{margin: 20}}>Game ended</div>:
          <div style={{margin: 20}}>
              <Row style={{margin: 10}}>Round {props.round.roundNo} ended.</Row>
              <Row style={{margin: 10}}><Button onClick={startRound}> Start round {props.round.roundNo + 1}</Button></Row>
          </div>}
      <ScoreTable game={props.game}/>
      {(props.round.roundNo === props.game.noRounds) && <WinnerMessage game={props.game}/>}
  </div>;
}

function ScoreTable({game}){
    const endedRounds = game.rounds.filter(round => round.roundStatus === GAME_STATUS.ENDED);
    return <div style={{margin: 20}}>
        <table className="table">
            <thead>
            <tr>
                <th/>
                {
                    Object.keys(game.teams).map((teamName, id) =>
                        <th key={id} scope="col" style={{backgroundColor: "pink"}}>{teamName}</th>)
                }
            </tr>
            </thead>
            <tbody>
            {
                endedRounds.map((round, id) =>
                    <tr key={id}>
                        <td>Round {round.roundNo}</td>
                        {
                            Object.keys(game.teams).map((teamName, id2) =>
                                <td key={id2} >{round.score[teamName]}</td>)
                        }
                    </tr>)

            }
            <tr>
                <td>Total</td>
                {
                    Object.keys(game.teams).map((teamName, id) =>
                        <td key={id} >{
                            endedRounds.reduce((totalScore, round) => totalScore + round.score[teamName], 0)
                        }</td>)
                }
            </tr>
            </tbody>
        </table>
    </div>;
}

function WinnerMessage({game}){
    const teams = Object.keys(game.teams);
    const teamsScore = teams.map(teamName =>
        game.rounds.reduce((scoreSummed, round) => scoreSummed + round.score[teamName], 0)
    );
    // TODO this needs to be universal, for 3 teams as well
    if (teamsScore[0] === teamsScore[1])
    {
        return <div className="centered-content"> It's a tie! </div>;
    }
    const winnerTeam = teamsScore[0] > teamsScore[1] ? teams[0] : teams[1];
    return <div className="centered-content"> <p>Team <strong> {` ${winnerTeam} `} </strong> has won!</p></div>;
}