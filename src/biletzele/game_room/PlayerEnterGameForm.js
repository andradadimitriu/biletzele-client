import React, {useEffect, useState} from "react";
import { Auth } from "aws-amplify";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../../utils_components/LoaderButton";
import { useAppContext } from "../../libs/contextLib";
import { useFormFields } from "../../libs/hooksLib";
import { onError } from "../../libs/errorLib";
import {useHistory, useParams} from "react-router-dom";
import { getGames } from "../../libs/utils";

import "./Forms.css";
const NO_WORDS = 5;

export default function PlayerEnterGameForm(props) {
  let { gameId, teamName } = useParams();
  const history = useHistory();
  const noWords = props.noWords ? props.noWords : NO_WORDS;
  const wordFields = Array.from({length: noWords},(v,k)=>`word${k+1}`);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [playerAlreadyRegistered, setPlayerAlreadyRegistered] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    playerName: "",
    ...wordFields.reduce((map, word) => {map[word]= ""; return map;},{})
  });

  function validateForm() {
    if(Object.values(fields).some(field => field.length === 0))
      return false;
    if(wordFields.map(wordField => fields[wordField]).some(word => word.includes(" ")
                                                                || /[A-Z]/.test(word)))
      return false;
    return true;
  }
  function userAlreadyInGame(teams, user){
    return teams.some(team => team.members.some(player => player.player === user.attributes.email));
  }
  async function addPlayerAndWords(playerName, words){
    //TODO change to getGame which will call to api query;
    const games = getGames();
    const game = games.find(game => game.gameId === gameId);
    const team = game.teams.find(team => team.name === teamName);
    const currentUser = await Auth.currentAuthenticatedUser();
    if(userAlreadyInGame(game.teams, currentUser)){
      return false;
    }
    team.members.push({player: currentUser.attributes.email, playerName});
    game.words.push(...words);
    window.localStorage.setItem('games', JSON.stringify(games));
    return true;
  }

  async function handleSubmit() {
    const words = wordFields.map(fieldName => fields[fieldName]);
    const playerAdded = await addPlayerAndWords(fields.playerName, words);
    if(!playerAdded) {
      setPlayerAlreadyRegistered(true);
    }
    history.push("/waiting-room", {params: {gameId, playerName: fields.playerName}})
  }

  useEffect(() => {
    (async function (){
      const games = getGames();
      const game = games.find(game => game.gameId === gameId);
      const currentUser = await Auth.currentAuthenticatedUser();
      console.log(currentUser);
      if(userAlreadyInGame(game.teams, currentUser)){
        setPlayerAlreadyRegistered(true);
      }
    })();
  }, []);


  return (
    <div className="center-form">
      {playerAlreadyRegistered && <PlayerAlreadyRegistered/>}
      {!playerAlreadyRegistered &&
      <Form onSubmit={handleSubmit}>
          <Form.Label>Player Name</Form.Label>
            <Form.Group controlId="playerName">
              <Form.Control
                value={fields.playerName}
                onChange={handleFieldChange}
                type="text"
              />
          </Form.Group>
          <Form.Label>Words</Form.Label>
          {wordFields.map((wordField, id) =>
            <Form.Group key={id} controlId={wordField}>
              <Form.Control
                autoFocus
                type="text"
                value={fields[wordField]}
                onChange={handleFieldChange}
              />
            </Form.Group>
            )
          }

        <LoaderButton
          block
          type="submit"
          disabled={!validateForm()}
          isLoading={isLoading}
        >
          Submit
        </LoaderButton>

      </Form>
      }
    </div>
  );
}

function PlayerAlreadyRegistered(){
  return <div> Player already registered in this game.</div>;
}