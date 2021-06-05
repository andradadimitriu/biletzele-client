import React from "react";
import {Row, Button} from "react-bootstrap";
import {newRound} from "../service/biletzele-websocket-service";
import {GAME_STATUS, ROUNDS} from "../utils/constants";

export default function RoundRest({round, game}) {
  async function startRound(){
      try {
          await newRound(game.gameId, round.roundNo + 1);
      }
      catch(e) {
          if (e.response.status !== 520) {
              throw e;
          }
      }
  }
  function getNewRound(){
      return game.rounds.find(r => r.roundNo === round.roundNo + 1)
  }
  return <div>
      {round.roundNo === game.noRounds ?
          <div style={{margin: 20}}>Game ended</div>:
          <div style={{margin: 20}}>
              <p style={{textAlign: "center"}}>Round <strong>{ROUNDS.find(r=> r.type === round.roundType).name}</strong> ended.</p>
              <Row style={{margin: 10}}><Button onClick={startRound}> Start round: <strong>{ROUNDS.find(r=> r.type === getNewRound().roundType).name}</strong></Button></Row>
          </div>}
      <ScoreTable game={game}/>
      {(round.roundNo === game.noRounds) && <WinnerMessage game={game}/>}
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
    return <div className="centered-content"> <p>Team <strong>{` ${winnerTeam} `}</strong> has won!</p></div>;
}