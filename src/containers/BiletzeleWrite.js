import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import {useHistory, useParams} from "react-router-dom";
import "./Forms.css";
const NO_WORDS = 5;

export default function BiletzeleWrite(props) {
  let { gameId, teamName } = useParams();
  const history = useHistory();
  const noWords = props.noWords ? props.noWords : NO_WORDS;
  const wordFields = Array.from({length: noWords},(v,k)=>`word${k+1}`);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
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
  
  function addPlayerAndWords(playerName, words){
    //TODO change to getGame which will call to api query;
    const games = getGames();

    const game = games.find(game => game.gameId === gameId);
    const team = game.teams.find(team => team.name === teamName);
    //TODO check if player already exists(after you add player by id)
    team.members.push({player:"", playerName});
    game.words.push(...words);
    window.localStorage.setItem('games', JSON.stringify(games));
  }

  function getGames(){
    return JSON.parse(window.localStorage.getItem("games"));
  }

  async function handleSubmit() {
    const words = wordFields.map(fieldName => fields[fieldName]);
    addPlayerAndWords(fields.playerName, words);
    history.push("/waiting-room", { params: {gameId, playerName: fields.playerName} })
  }

  return (
    <div className="center-form">
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
          {wordFields.map(wordField =>
            <Form.Group controlId={wordField}>
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
          bsSize="large"
          type="submit"
          disabled={!validateForm()}
          isLoading={isLoading}
        >
          Submit
        </LoaderButton>

      </Form>
    </div>
  );
}
