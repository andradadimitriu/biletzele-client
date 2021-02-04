import React from "react";
import {Row, Button} from "react-bootstrap";
import {newRound} from "../service/biletzele-service";
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
      props.reloadGame();
  }
  return <div>
      {props.round.roundNo === props.game.noRounds ?
          <div style={{margin: 20}}>Game ended</div>:
          <div style={{margin: 20}}>
              <Row style={{margin: 10}}>Round {props.round.roundNo} ended.</Row>
              <Row style={{margin: 10}}><Button onClick={startRound}> Start round {props.round.roundNo + 1}</Button></Row>
          </div>}
      <ScoreTable game={props.game}/>
  </div>;
}

function ScoreTable({game}){
    const endedRounds = game.rounds.filter(round => round.roundStatus === GAME_STATUS.ENDED);
    debugger;
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