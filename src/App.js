import React, {useCallback, useEffect, useState} from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import "./app.css";
import Routes from "./Routes";
import {AppContext} from "./libs/contextLib";
import {Auth} from "aws-amplify";
import {useHistory} from "react-router-dom";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronDown, faChevronRight, faSpinner} from '@fortawesome/free-solid-svg-icons';

import websocket from './biletzele/service/reconnecting-websocket';
import config from "./config";
import Help from "./biletzele/utils/Help";

library.add(faSpinner, faChevronDown, faChevronRight);

function useMessages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        function handleMessageOnApp(message) {
            setMessages([...messages, message]);
        }
        websocket.on(handleMessageOnApp);
        handleMessageOnApp.originalName = "handleMessageOnApp";
        return () => websocket.off(handleMessageOnApp);
    }, [messages, setMessages]);

    return messages;
}

function App() {
    const history = useHistory();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [gameId, setGameId] = useState(undefined);
    const [showHelp, setShowHelp] = useState(false);
    const messages = useMessages();
    const [isConnected, setIsConnected] = useState(websocket.isConnected());
    const helpModal = useCallback(() => setShowHelp(true),[]);

    useEffect(() => {
        return websocket.onStateChange(setIsConnected);
    }, [setIsConnected]);

    useEffect(() => {

        if (!gameId || !websocket) return;
        if (isConnected) {
            console.log(`enter room: ${gameId}`);
            websocket.send(JSON.stringify({action: "enterroom", data: gameId}));
        }
    }, [gameId, isConnected]);

    useEffect(() => {
        onLoad();
    }, []);

    function setAppLevelGameId(routeGameId) {
        if (gameId) return;
        setGameId(routeGameId);
    }

    async function onLoad() {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
        } catch (e) {
            setIsAuthenticating(false);
        }
        setIsAuthenticating(false);
    }

    async function handleLogout() {
        await Auth.signOut();

        userHasAuthenticated(false);
        history.push("/login");
    }
    return <>
        {!isAuthenticating && (
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
                                    <Nav.Link onClick={helpModal}>Help</Nav.Link>
                                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link onClick={helpModal}>Help</Nav.Link>
                                    <Nav.Link href="/signup">Signup</Nav.Link>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar>
                </div>
                <AppContext.Provider
                    value={{isAuthenticated, userHasAuthenticated}}
                >
                    <Help show={showHelp} setShow={setShowHelp}/>
                    <Routes setAppLevelGameId={setAppLevelGameId}/>
                    <div>
                        {config.env !== "prod" && <>
                            <h1>Websocket {isConnected ? 'Connected' : 'Disconnected'}</h1>
                            {messages.map((m, k) => <p key={k}>{JSON.stringify(m, null, 2)}</p>)}
                        </>}
                    </div>
                </AppContext.Provider>
            </>
        )}
    </>;
}

export default App;