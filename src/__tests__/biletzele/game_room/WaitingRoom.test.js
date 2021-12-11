import React from 'react';
import {act, render, waitForElement, within, cleanup} from '@testing-library/react';
import {Auth} from 'aws-amplify';
import {faLib} from "../../mocks/fontawesomeMocks";
import {reactRouterMock} from '../../mocks/moduleMocks';
import * as dataService from '../../../biletzele/service/biletzele-service';
import WaitingRoom from "../../../biletzele/game_room/WaitingRoom";
import {
    mockedGame,
    mockedUser,
    mockGameId,
    nonExistentGame,
    pendingGame,
    currentMockedUser, otherTeamPlayingMockedUser2
} from "../../mocks/GameMocks";
import {shallow} from "enzyme";

const credentialsMock = jest.spyOn(Auth, "currentCredentials");
const getGameMock = jest.spyOn(dataService, "getGame");

afterEach(cleanup);

describe('<WaitingRoom/> tests', () => {

    it('shows loading button only on first render', () => {
        const wrapper = shallow(<WaitingRoom setAppLevelGameId={() => undefined}/>);
        expect(wrapper.find('Loading')).toHaveLength(1);
        expect(wrapper.find('CouldNotFindGame')).toHaveLength(0);
        expect(wrapper.find('WaitingRoomContent')).toHaveLength(0);

    });

    it('gets game and user', async () => {
        getGameMock.mockImplementation(() => mockedGame);
        credentialsMock.mockImplementation(
            () => mockedUser);
        await act(async () => {
            render(<WaitingRoom setAppLevelGameId={() => undefined}/>);
        });
        expect(getGameMock).toHaveBeenCalledTimes(1);
        expect(getGameMock).toHaveBeenCalledWith(mockGameId);
        expect(credentialsMock).toHaveBeenCalledTimes(1);
    });

    it('game does not exist', async () => {
        getGameMock.mockImplementation(() => nonExistentGame);
        credentialsMock.mockImplementation(
            () => mockedUser);
        const wrapper = render(<WaitingRoom setAppLevelGameId={() => undefined}/>);
        await waitForElement(() => wrapper.getByText("Could Not Find Game"));

    });

    it('game exists; loads elements', async () => {
        getGameMock.mockImplementation(() => mockedGame);
        credentialsMock.mockImplementation(
            () => mockedUser);
        let wrapper;
        await act(async () => {
            wrapper = render(<WaitingRoom setAppLevelGameId={() => undefined}/>);
        });
        expect(wrapper.getByText(/Game link/i).textContent).toBe("Game link");
        expect(wrapper.container.textContent).toContain(`join-game/${mockGameId}`);
        expect(wrapper.container.querySelectorAll("table")).toHaveLength(Object.keys(mockedGame.teams).length);
        expect(wrapper.container.querySelectorAll("table").item(0).textContent).toContain(Object.keys(mockedGame.teams)[0]);
        expect(wrapper.container.querySelectorAll("table").item(1).textContent).toContain(Object.keys(mockedGame.teams)[1]);

    });
    describe('switch team button', () => {

        const switchTeamButtonText = "switch team";
        test('shows change team button next to current player when game is pending', async () => {
            getGameMock.mockImplementation(() => pendingGame);
            credentialsMock.mockImplementation(
                () => currentMockedUser);

            let wrapper;
            await act(async () => {
                wrapper = render(<WaitingRoom setAppLevelGameId={() => undefined}/>);
            });
            const currentPlayerName = Object.values(pendingGame.teams.team1.members).find(player => player.playerId === currentMockedUser.identityId).playerName;
            const table = wrapper.container.querySelectorAll("table").item(0);

            const currentUserRow = within(table).getByText(currentPlayerName).closest("td");
            const switchTeamsButton = within(currentUserRow).getByText(switchTeamButtonText).closest("button");
            expect(switchTeamsButton).not.toBeDisabled();
        });

        test('no change team button next to other players', async () => {
            getGameMock.mockImplementation(() => pendingGame);
            credentialsMock.mockImplementation(
                () => currentMockedUser);

            let wrapper;
            await act(async () => {
                wrapper = render(<WaitingRoom setAppLevelGameId={() => undefined}/>);
            });
            const sameTeamPlayerName = Object.values(pendingGame.teams.team1.members).find(player => player.playerId === otherTeamPlayingMockedUser2.identityId).playerName;
            const otherTeamPlayerName = Object.values(pendingGame.teams.team2.members).find(player => player.playerId === mockedUser.identityId).playerName;
            const table1 = wrapper.container.querySelectorAll("table").item(0);
            const table2 = wrapper.container.querySelectorAll("table").item(1);

            const sameTeamPlayerNameRow = within(table1).getByText(sameTeamPlayerName).closest("td");
            const otherTeamPlayerNameRow = within(table2).getByText(otherTeamPlayerName).closest("td");
            const switchTeamsButtonSameTeamPlayer = within(sameTeamPlayerNameRow).queryByText(switchTeamButtonText);
            const switchTeamsButtonOtherTeamPlayer = within(otherTeamPlayerNameRow).queryByText(switchTeamButtonText);
            expect(switchTeamsButtonSameTeamPlayer).not.toBeInTheDocument();
            expect(switchTeamsButtonOtherTeamPlayer).not.toBeInTheDocument();

        });
    });
});