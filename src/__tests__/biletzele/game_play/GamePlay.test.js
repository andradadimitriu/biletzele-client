import React from 'react';
import { shallow } from 'enzyme';

import GamePlay from "../../../biletzele/game_play/GamePlay";
import { cleanup } from '@testing-library/react';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    gameId: 'AAAA',
  })
}));

describe('<GamePlay />', () => {
  it('renders without crashing', () => {

    shallow(<GamePlay setAppLevelGameId={()=>undefined}/>);
  });
});