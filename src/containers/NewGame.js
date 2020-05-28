import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Bootstrap from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./NewGame.css";

export default function NewGame() {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    gameName: "",
    team1Name: "",
    team2Name: "",
  });

  function validateForm() {
    return fields.gameName.length > 0 && fields.game.length > 0 ;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {

    } catch (e) {
      onError(e);
      setIsLoading(false);
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
              value={fields.team1Name}
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
            Login
          </LoaderButton>

        </Form>
      </div>
    );
}
