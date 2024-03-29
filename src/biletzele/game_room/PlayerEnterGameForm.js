import React, {useEffect, useState} from "react";
import {Auth} from "aws-amplify";
import Form from 'react-bootstrap/Form';
import LoaderButton from "../../utils_components/LoaderButton";
import {useHistory, useParams} from "react-router-dom";

import "./forms.css";
import {addPlayerToGame} from "../service/biletzele-websocket-service";
import websocket from '../service/reconnecting-websocket';
import {MESSAGE_TYPE} from "../utils/constants";
import {Formik} from 'formik';
import * as yup from 'yup';

const NO_WORDS = 5;
const wordFields = Array.from({length: NO_WORDS},(v, k)=>`word${k+1}`);
const formSchema = yup.object().shape({
  playerName: yup.string().required("Player name is required"),
  ...wordFields.reduce((map, word) => {
    map[word]= yup.string().required("All words are required")
        .matches(/^[\S]+$/, "No spaces")
        .matches(/[a-z]+$/, "Only word characters")
        .matches(/^[a-z]+$/g, "No proper nouns (no upper case)");
    return map;},{})
});

export default function PlayerEnterGameForm() {
  let { gameId, teamName } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [playerAlreadyRegistered, setPlayerAlreadyRegistered] = useState(false);

  async function addPlayerAndWords(playerName, words){
    const currentUser = await Auth.currentCredentials();
    return await addPlayerToGame(gameId, teamName, {playerId: currentUser.identityId, playerName}, words);
  }
  useEffect(() => {
    function handleMessageOnEnterGameForm(message) {
      const data = JSON.parse(message);
      console.log(`message received: ${message}`);
      switch (data.type){
        case `${MESSAGE_TYPE.NEW_PLAYER}_FAILURE`:
        {
          setIsLoading(false);
          setPlayerAlreadyRegistered(true);
          break;
        }
        case `${MESSAGE_TYPE.NEW_PLAYER}_SUCCESS`:{
          history.push(`/biletzele/waiting-room/${gameId}`);
          break;
        }
        default:
      }
    }
    handleMessageOnEnterGameForm.originalName="handleMessageOnEnterGameForm";
    websocket.on(handleMessageOnEnterGameForm);
    return () => websocket.off(handleMessageOnEnterGameForm);

  },[gameId, history]);

  async function handleSubmit(values) {
    const words = wordFields.map(fieldName => values[fieldName]);
    try {
      setIsLoading(true);
      await addPlayerAndWords(values.playerName, words);
    }
    catch(e){
      console.log(`e: ${e}`);
      if(e.response.status === 520) {
        setPlayerAlreadyRegistered(true);
        setIsLoading(false);
      }
    }
  }
  return (
    <div className="center-form">

      <Formik
          validationSchema={formSchema}
          onSubmit={handleSubmit}
          initialValues={{
            playerName: "",
            ...wordFields.reduce((map, word) => {map[word]= ""; return map;},{})
          }}
      >
        {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            dirty,
            errors,
          }) => (
      <Form onSubmit={handleSubmit}>
          <Form.Label>Player Name</Form.Label>
            <Form.Group controlId="playerName">
              <Form.Control
                  type="text"
                  name="playerName"
                  value={values.playerName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.playerName && !errors.playerName}
                  isInvalid={touched.playerName && errors.playerName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.playerName}
              </Form.Control.Feedback>
          </Form.Group>
          <Form.Label>Words</Form.Label>
          <Form.Text className="text-muted">
            Please enter a single noun or adjective per field.
          </Form.Text>
        {wordFields.map((wordField, id) =>
            <Form.Group key={id} controlId={wordField}>
              <Form.Control
                  type="text"
                  name={wordField}
                  value={values[wordField]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched[wordField] && !errors[wordField]}
                  isInvalid={touched[wordField] && errors[wordField]}
              />
              <Form.Control.Feedback type="invalid">
                {errors[wordField]}
              </Form.Control.Feedback>
            </Form.Group>
            )
          }
        {playerAlreadyRegistered && <PlayerAlreadyRegistered/>}
        <LoaderButton
          block
          type="submit"
          disabled={!(isValid && dirty)}
          isLoading={isLoading}
        >
          Submit
        </LoaderButton>

      </Form>  )}
      </Formik>
    </div>
  );
}

function PlayerAlreadyRegistered(){
  return <div style={{color: "red"}}> User already registered in this game or playername already in use.</div>;
}