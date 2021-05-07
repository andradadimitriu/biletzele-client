import { faSpinner} from '@fortawesome/free-solid-svg-icons';
import {library} from "@fortawesome/fontawesome-svg-core";
library.add( faSpinner);
import {mockGameId} from "./GameMocks";
export const reactRouterMock = jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    gameId: mockGameId,
  })
}));