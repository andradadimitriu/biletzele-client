
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../../utils_components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import { onError } from "../../libs/errorLib";
import "./NewGame.css";
import {useHistory} from "react-router-dom";
import {createGame} from "../service/biletzele-service";

export default function NewGame() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    gameName: "",
    team1Name: "",
    team2Name: "",
    selectedTeam: undefined
  });
  function validateForm() {
    return fields.gameName.length > 0 && fields.team1Name.length > 0 && fields.team2Name.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    try {
      const createdGame = await createGame(fields.gameName,
          fields.team1Name,
          fields.team2Name);
      setIsLoading(false);

      //TODO error message if created game does not exist
      history.push(`/biletzele/new-player/${createdGame}/${fields.selectedTeam}`);
    } catch (e) {
      setIsLoading(false);
      onError(e);
    }

  }


  return (
      <div className="NewGame">
        <Form onSubmit={handleSubmit}>
          <Form.Label>Game Name</Form.Label>
          <Form.Group controlId="gameName">
            <Form.Control
              autoFocus
              type="gameName"
              value={fields.gameName}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Label>Team 1 Name</Form.Label>
          <Form.Group controlId="team1Name">
            <Form.Control
              value={fields.team1Name}
              onChange={handleFieldChange}
              type="team1Name"
            />
          </Form.Group>
          <Form.Label>Team 2 Name</Form.Label>
          <Form.Group controlId="team2Name">
            <Form.Control
              value={fields.team2Name}
              onChange={handleFieldChange}
              type="team2Name"
            />
          </Form.Group>
            <Form.Label>Choose your team:</Form.Label>
            <Form.Group controlId="selectedTeam">
              <Form.Control as="select"
                            defaultValue={0}
                            onChange={handleFieldChange}
                            >
                <option disabled value={0}>Select a team to play in</option>
                {fields.team1Name && <option>{fields.team1Name}</option>}
                {fields.team2Name && <option>{fields.team2Name}</option>}
              </Form.Control>
          </Form.Group>
          <LoaderButton
            block
            disabled={!validateForm()}
            type="submit"
            isLoading={isLoading}
          >
            Create Game
          </LoaderButton>

        </Form>
      </div>
    );
}
