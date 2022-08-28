import React from "react";
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";

function Help({show, setShow}) {

    return (
            <Modal size="lg"
                   show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>How to play</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Biletzele is a fun team adversarial <strong>word guessing</strong> game.</p>
                    <h3>Set up the game</h3>
                    <p>Each team needs to have two or more players, so at least four people playing in total in a game. There is no upper limit on the number of players and the teams don't necessarily need to have the same number of players.</p>
                    <p>When joining a game, you start by thinking of some good nouns or adjectives, something that you'd like others to guess. Don't think too hard though. Anything goes.</p>
                    <p > <span style={{color:"red"}}>Please gather with all the other players on a platform that allows group video calls: Discord, Zoom, FB Messenger, Skype, whatever.</span> We will be adding video soon on our platform as well. But we are pretty new, so please be patient with us.</p>
                    <h3>Game play</h3>
                    <p>Each team takes turn at guessing as many words as possible in 1 minute, from the "bag of words" gathered from all the players.</p>
                    <p>The player who's turn it is will draw a word, and help the others in his team to guess the word as fast as possible, using only the means allowed in a specific round. After the team guesses the word, the player can press next, and they will have to help the others guess the new word drawn, and so on, until the team is out time.</p>
                    <p>When all the words have been guessed, it is time to go to the next round!</p>
                    <h3>It's easy</h3>
                    <p>You will find guiding text at each stage of the game, so don't worry, you can learn while playing. You are in safe, supporting hands. </p>
                    <p>If something is unclear at any stage, or if you think things could have been described in a clearer way, feel free to email me at <strong>biletzele-support@gmail.com</strong>.</p>
                    <h3>So get started</h3>
                    <p>Go ahead and click the New Game tab to create a new game or join a game in the Pending Games tab. </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShow(false)}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
    );
}

export default Help;