import {mockedUser, pendingGame} from "../../mocks/GameMocks";
import {act, render} from "@testing-library/react";
import React from "react";
import GameTile from "../../../biletzele/game_room/GameTile";

describe('<GameTile>', () => {
    test('choose team for me chooses the team with the smallest number of members', () => {
        let wrapper;
        act(() => {
            wrapper = render(<GameTile game={pendingGame} user={mockedUser}/>);
        });
        const joinLink = wrapper.getByText(/Choose team for me/i).href;
        const joinLinkRegex = /https*:\/\/(?:[A-Za-z]+\/)+new-player\/(?:[A-Za-z]+\/)+(\w+)/;
        const newPlayerTeam = joinLink.match(joinLinkRegex)[1];

        const smallestTeam = "team2";
        expect(newPlayerTeam).toBe(smallestTeam);

    });
});