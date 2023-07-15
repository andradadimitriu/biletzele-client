import React, {useEffect, useState} from "react";
import GameTile from "./GameTile";
import Loading from "../../utils_components/Loading";
import {Auth} from "aws-amplify";
import Form from 'react-bootstrap/Form';

export default function GamesList({getGames}) {

    const [games, setGames] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [searchText, setSearchText] = useState("");
    const [filteredGames, setFilteredGames] = useState([]);

    const [isLoading, setIsLoading] = useState(undefined);
    useEffect(() => {
        (async function() {
            setIsLoading(true);
            const user = await Auth.currentCredentials();
            const gamez = await getGames(user);
            setCurrentUser(user);
            setIsLoading(false);
            setGames(gamez);
            setFilteredGames(gamez);
        })()},[getGames])
    useEffect(() => {
        if (searchText.length > 0) {
            setFilteredGames(games.filter(game => game.gameName.toLowerCase()
                .includes(searchText.toLowerCase())));
        }
    }, [searchText, games])
    return (
        <div className="horizontalflex">
            {isLoading ? <Loading className="margin-full"/> :
                <React.Fragment>
                    <Form.Control type="text" placeholder="Search" value={searchText}
                                  className="mr-sm-2 card-styling"
                                  onChange={(event) => setSearchText(event.target.value)}/>
                    {filteredGames.map((game, id) => <GameTile key={id} game={game} user={currentUser}/>)}
                </React.Fragment>}
        </div>
    );
}
