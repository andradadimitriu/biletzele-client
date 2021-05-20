import React, { useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import "./App.css";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner} from '@fortawesome/free-solid-svg-icons';
import websocket from './biletzele/service/reconnecting-websocket';

library.add( faSpinner);

function useMessages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        function handleMessageOnApp(message) {
            setMessages([...messages, message]);
        }
        websocket.on(handleMessageOnApp);
        return () => websocket.off(handleMessageOnApp);
    }, [messages, setMessages]);

    return messages;
}

function App() {
    const history = useHistory();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [gameId, setGameId] = useState(undefined);

    const messages = useMessages();
    const [isConnected, setIsConnected] = useState(websocket.isConnected());

    useEffect(() => {
        return websocket.onStateChange(setIsConnected);
    }, [setIsConnected]);

    useEffect(() => {

        if(!gameId || !websocket) return;
        if(isConnected) {
            console.log(`enter room: ${gameId}`);
            websocket.send(JSON.stringify({ action: "enterroom", data: gameId}));
        }
    }, [gameId, isConnected]);

  useEffect(() => {
    onLoad();
  }, []);

  function setAppLevelGameId(routeGameId){
      if(gameId) return;
      setGameId(routeGameId);
  }

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);      }
    }

    setIsAuthenticating(false);
  }
    async function handleLogout() {
      await Auth.signOut();

      userHasAuthenticated(false);
      history.push("/login");
    }
return (
  !isAuthenticating && (
    <>
        <div className="bar">
            <Navbar bg="light" variant="light">
              <Navbar.Brand href="#home">Biletzele</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="/biletzele">Home</Nav.Link>
              </Nav>
              <Nav className="justify-content-end">
                {isAuthenticated ? (
                              <>
                                <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
                              </>
                            ) : (
                              <>
                                <Nav.Link href="/signup">Signup</Nav.Link>
                                <Nav.Link href="/login">Login</Nav.Link>
                              </>
                            )}
              </Nav>
            </Navbar>
      </div>
      <AppContext.Provider
        value={{ isAuthenticated, userHasAuthenticated }}
      >
        <Routes setAppLevelGameId={setAppLevelGameId}/>
          <div>
              <h1>Websocket {isConnected ? 'Connected' : 'Disconnected'}</h1>
              {messages.map(m => <p>{JSON.stringify(m, null, 2)}</p>)}
          </div>
      </AppContext.Provider>
    </>
  )
);
}

export default App;