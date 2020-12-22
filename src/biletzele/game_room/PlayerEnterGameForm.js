import React, {useState} from "react";
import { Auth } from "aws-amplify";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../../utils_components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import {useHistory, useParams} from "react-router-dom";

import "./Forms.css";
import {addPlayerToGame} from "../service/biletzele-service";
const NO_WORDS = 5;

export default function PlayerEnterGameForm(props) {
  let { gameId, teamName } = useParams();
  const history = useHistory();
  const noWords = props.noWords ? props.noWords : NO_WORDS;
  const wordFields = Array.from({length: noWords},(v,k)=>`word${k+1}`);
  const [isLoading, setIsLoading] = useState(false);
  const [playerAlreadyRegistered, setPlayerAlreadyRegistered] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    playerName: "",
    ...wordFields.reduce((map, word) => {map[word]= ""; return map;},{})
  });

  function validateForm() {
    if(Object.values(fields).some(field => field.length === 0))
      return false;
    return !wordFields.map(wordField => fields[wordField]).some(word => word.includes(" ")
        || /[A-Z]/.test(word));

  }

  async function addPlayerAndWords(playerName, words){
    const currentUser = await Auth.currentCredentials();
    return await addPlayerToGame(gameId, teamName, {playerId: currentUser.identityId, playerName}, words);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const words = wordFields.map(fieldName => fields[fieldName]);
    try {
      await addPlayerAndWords(fields.playerName, words);
      history.push(`/biletzele/waiting-room/${gameId}`);
    }
    catch(e){
      if(e.response.status === 520) {
        setPlayerAlreadyRegistered(true);
        setIsLoading(false);
      }
    }
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
        {playerAlreadyRegistered && <PlayerAlreadyRegistered/>}
        <LoaderButton
          block
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

function PlayerAlreadyRegistered(){
  return <div style={{color: "red"}}> User already registered in this game or playername already in use.</div>;
}