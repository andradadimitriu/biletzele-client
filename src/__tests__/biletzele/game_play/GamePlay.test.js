import React from 'react';
import { shallow } from 'enzyme';
import  {faLib} from "../../mocks/fontawesomeMocks";

import GamePlay from "../../../biletzele/game_play/GamePlay";
import {act, cleanup, fireEvent, render, waitForElement} from '@testing-library/react';
import {
  mockedGame,
  mockedRoundsFirstActive,
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

    expect(wrapper.getByText(/other team/i).textContent).toBe("The other team is playing.");
    expect(wrapper.getByText(/attention/i).textContent).toBe("Pay attention to them.");
  });

  it("shows correct round - Mime", async () => {
    getGameMock.mockImplementation(() => mockedGame);
    credentialsMock.mockImplementation(
        () => otherTeamPlayingMockedUser);
    let wrapper;
    await act(async () => {
      wrapper = render(<GamePlay setAppLevelGameId={()=>undefined}/>);
    });
    expect(wrapper.getByText(/Round/i)).toBeTruthy();
    expect(wrapper.getByText(/Mime the word/i).textContent).toBe("Mime the word");
    fireEvent.click(wrapper.getByText(/Mime the word/i));
    expect(wrapper.container.textContent).toContain("Use your body and face to make people think of the word to be guessed. Do not use your voice, do not point at existing objects!");

  });

  it("shows correct round - Describe", async () => {

    const mockedGameCorrectRound = {...mockedGame, rounds: mockedRoundsFirstActive}
    getGameMock.mockImplementation(() => mockedGameCorrectRound);
    credentialsMock.mockImplementation(
        () => otherTeamPlayingMockedUser);
    let wrapper;
    await act(async () => {
      wrapper = render(<GamePlay setAppLevelGameId={()=>undefined}/>);
    });
    expect(wrapper.getByText(/Round/i)).toBeTruthy();
    expect(wrapper.getByText(/Describe/i).textContent).toBe("Describe the word");
    fireEvent.click(wrapper.getByText(/Describe the word/i));
    expect(wrapper.container.textContent).toContain("Describe the word to be guessed, without saying the word or any derivatives of the word.");

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

    expect(wrapper.getByText(/Start/i).textContent).toBe("Start");
  });

});