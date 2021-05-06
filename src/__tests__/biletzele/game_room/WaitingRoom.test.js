import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { faSpinner} from '@fortawesome/free-solid-svg-icons';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import * as biletzeleService from "../../../biletzele/service/biletzele-service";
import { Auth } from 'aws-amplify';

library.add( faSpinner);

import WaitingRoom from "../../../biletzele/game_room/WaitingRoom";
import {library} from "@fortawesome/fontawesome-svg-core";
import {mockedGame} from "../../mocks/GameMocks";
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    gameId: 'AAAA',
  })
}));
Auth.currentCredentials = jest.fn().mockImplementation(
    () => ({
      "identityId": "eu-west-2:1ce41008-3355-4013-aa65-dd7b393d661e",
    }));
biletzeleService.getGame = jest.fn((_)=> mockedGame);
let container = null;
beforeEach(() => {
  console.log("before test");
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  console.log("before test end");

});

afterEach(() => {
  // cleanup on exiting
  console.log("after test");

  unmountComponentAtNode(container);
  container.remove();
  container = null;
  console.log("after test end");

});


describe('<WaitingRoom />', () => {

  it('shows loading button only on first load', () => {
    const wrapper = shallow(<WaitingRoom setAppLevelGameId={()=>undefined}/>);
    expect(wrapper.find('Loading')).toHaveLength(1);
    expect(wrapper.find('CouldNotFindGame')).toHaveLength(0);
    expect(wrapper.find('WaitingRoomContent')).toHaveLength(0);

  });

  it('shows waiting room content after game and user was set', async () => {
    await act(async () => {
      render(
          <WaitingRoom
              setAppLevelGameId={()=>undefined}
          />
      , container)
    });
    const wrc = container.querySelector("WaitingRoomContent");
    console.log(`container: ${container}`);
    console.log(`container body: ${container.body}`);
    // console.log(`container: ${JSON.stringify(container)}`);
    // console.log(`container t: ${container.textContent}`);
    // console.log(`container text type: ${typeof container.textContent}`);
    console.log(`wrc: ${wrc}`);
    expect(container.querySelector("WaitingRoomContent")).toHaveLength(1);


  });
});