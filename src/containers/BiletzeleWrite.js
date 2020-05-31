import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import { useHistory } from "react-router-dom";
import "./Forms.css";
const NO_WORDS = 5;

export default function BiletzeleWrite(props) {
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
    return fields.every(field => field.length > 0);
  }
  
  function addWords(words){
    //TODO
  }

  async function handleSubmit(event) {
    const words = wordFields.map(fieldName => fields[fieldName]);
    addWords(words);
    history.push("/waiting-room", { params: {gameId: props.gameId, playerName: fields.playerName} })
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
          isLoading={isLoading}
        >
          Submit
        </LoaderButton>

      </Form>
    </div>
  );
}
