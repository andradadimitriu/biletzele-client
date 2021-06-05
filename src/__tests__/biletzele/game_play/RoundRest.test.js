import React from 'react';
import { shallow } from 'enzyme';

import RoundRest from "../../../biletzele/game_play/RoundRest";
import {act, cleanup, render} from '@testing-library/react';
import {
  mockedGame,
  mockedUser,
  mockedRoundsGameEnded
} from "../../mocks/GameMocks";
import {Auth} from "aws-amplify";
import * as dataService from "../../../biletzele/service/biletzele-service";
import {getByTextContent} from "../../utils/utils";
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    gameId: 'AAAA',
  })
}));
const credentialsMock = jest.spyOn(Auth, "currentCredentials");

const getGameMock = jest.spyOn(dataService, "getGame");

afterEach(cleanup);

describe('<RoundRest />', () => {
  it('shows score table when there are still rounds to go', () => {
    const wrapper = shallow(<RoundRest game={mockedGame} round={mockedGame.rounds[1]}/>);
    expect(wrapper.find('ScoreTable')).toHaveLength(1);
  });
  it('shows winner when the game ended', () => {
    const wrapper = shallow(<RoundRest game={mockedGame} round={mockedGame.rounds[3]}/>);
    expect(wrapper.find('WinnerMessage')).toHaveLength(1);
  });

  it('shows game ended messages', async () => {
    const mockedGameCorrectRound = {...mockedGame, rounds: mockedRoundsGameEnded}
    getGameMock.mockImplementation(() => mockedGameCorrectRound);
    credentialsMock.mockImplementation(
        () => mockedUser);
    let wrapper;
    await act(async () => {
      wrapper = render(<RoundRest game={mockedGameCorrectRound} round={mockedRoundsGameEnded[3]}/>);
    });
    expect(wrapper.getByText(/Game ended/i).textContent).toBe("Game ended");
    expect(wrapper.getByText(getByTextContent("Team  team 2  has won"))).toBeInTheDocument();
  });


  it('shows ', async () => {
    const mockedGameCorrectRound = {...mockedGame, rounds: mockedRoundsGameEnded}
    getGameMock.mockImplementation(() => mockedGameCorrectRound);
    credentialsMock.mockImplementation(
        () => mockedUser);
    let wrapper;
    await act(async () => {
      wrapper = render(<RoundRest game={mockedGameCorrectRound} round={mockedRoundsGameEnded[3]}/>);
    });
    expect(wrapper.getByText(/Game ended/i).textContent).toBe("Game ended");
    expect(wrapper.getByText(getByTextContent("Team  team 2  has won"))).toBeInTheDocument();
  });
});