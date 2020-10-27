import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../../utils_components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import { onError } from "../../libs/errorLib";
import "./NewGame.css";

export default function NewGame() {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    gameName: "",
    team1Name: "",
    team2Name: "",
  });

  function validateForm() {
    return fields.gameName.length > 0 && fields.team1Name.length > 0 && fields.team2Name.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
        const games = JSON.parse(window.localStorage.getItem("games"));
        games.push({
                       gameName: fields.gameName,
                       words: 0,
                       gameId: games.length.toString(),
                       teams: [{
                         name: fields.team1Name,
                         members: []
                       },
                       {
                         name: fields.team2Name,
                         members: []
                       }]
                   });
        window.localStorage.setItem('games', JSON.stringify(games));
    } catch (e) {
      onError(e);
    }
    setIsLoading(false);

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
