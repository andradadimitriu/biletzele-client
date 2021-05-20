import React from 'react';
import { shallow } from 'enzyme';
import  {faLib} from "../../mocks/fontawesomeMocks";

import GamePlay from "../../../biletzele/game_play/GamePlay";
import {act, cleanup, render, waitForElement} from '@testing-library/react';
import {
  mockedGame,
  mockedUser,
  mockGameId,
  nonExistentGame,
  otherTeamPlayingMockedUser,
  guessingMockedUser,
  myTurnMockedUser
} from "../../mocks/GameMocks";
import {Auth} from "aws-amplify";
import * as dataService from "../../../biletzele/service/biletzele-service";
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    gameId: 'AAAA',
  })
}));
const credentialsMock = jest.spyOn(Auth, "currentCredentials");

const getGameMock = jest.spyOn(dataService, "getGame");

afterEach(cleanup);

describe('<GamePlay />', () => {
  it('shows loading button on first load', () => {
    const wrapper = shallow(<GamePlay setAppLevelGameId={()=>undefined}/>);
    expect(wrapper.find('Loading')).toHaveLength(1);
  });

  it('gets game and user', async () => {
    getGameMock.mockImplementation(() => mockedGame);
    credentialsMock.mockImplementation(
        () => mockedUser);
    await act(async () => {
      render(<GamePlay setAppLevelGameId={()=>undefined}/>);
    });
    expect(getGameMock).toHaveBeenCalledTimes(1);
    expect(getGameMock).toHaveBeenCalledWith(mockGameId);
    expect(credentialsMock).toHaveBeenCalledTimes(1);
  });

  it('game does not exist', async () => {
    getGameMock.mockImplementation(() => nonExistentGame);
    credentialsMock.mockImplementation(
        () => mockedUser);
    const wrapper = render(<GamePlay setAppLevelGameId={()=>undefined}/>);
    await waitForElement(() => wrapper.getByText("Could Not Find Game"));

  });

  it("other team's turn", async () => {
    getGameMock.mockImplementation(() => mockedGame);
    credentialsMock.mockImplementation(
        () => otherTeamPlayingMockedUser);
    let wrapper;
    await act(async () => {
      wrapper = render(<GamePlay setAppLevelGameId={()=>undefined}/>);
    });

    expect(wrapper.getByText(/other team/i).textContent).toBe("The other team is playing. Pay attention to them.");
  });

  it("guessing turn", async () => {
    getGameMock.mockImplementation(() => mockedGame);
    credentialsMock.mockImplementation(
        () => guessingMockedUser);
    let wrapper;
    await act(async () => {
      wrapper = render(<GamePlay setAppLevelGameId={()=>undefined}/>);
    });

    expect(wrapper.getByText(/Time to guess/i).textContent).toBe("Time to guess");
  });

  it("user's turn to play", async () => {
    getGameMock.mockImplementation(() => mockedGame);
    credentialsMock.mockImplementation(
        () => myTurnMockedUser);
    let wrapper;
    await act(async () => {
      wrapper = render(<GamePlay setAppLevelGameId={()=>undefined}/>);
    });

    expect(wrapper.getByText(/Start/i).textContent).toBe(" Start ");
  });

});