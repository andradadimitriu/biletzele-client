import React from 'react';
import { act, render, waitForElement } from '@testing-library/react';
import { Auth } from 'aws-amplify';

import {reactRouterMock} from '../../mocks/moduleMocks';
import * as dataService from '../../../biletzele/service/biletzele-service';
import WaitingRoom from "../../../biletzele/game_room/WaitingRoom";
import {mockedGame, mockedUser, mockGameId, nonExistentGame} from "../../mocks/GameMocks";
import {shallow} from "enzyme";

const credentialsMock = jest.spyOn(Auth, "currentCredentials");

const getGameMock = jest.spyOn(dataService, "getGame");

describe('<WaitingRoom/> tests', () => {

 it('shows loading button only on first render', () => {
  const wrapper = shallow(<WaitingRoom setAppLevelGameId={()=>undefined}/>);
  expect(wrapper.find('Loading')).toHaveLength(1);
  expect(wrapper.find('CouldNotFindGame')).toHaveLength(0);
  expect(wrapper.find('WaitingRoomContent')).toHaveLength(0);

 });

 it('gets game and user', async () => {
  getGameMock.mockImplementation(() => mockedGame);
  credentialsMock.mockImplementation(
      () => mockedUser);
  await act(async () => {
   render(<WaitingRoom setAppLevelGameId={()=>undefined}/>);
  });
  expect(getGameMock).toHaveBeenCalledTimes(1);
  expect(getGameMock).toHaveBeenCalledWith(mockGameId);
  expect(credentialsMock).toHaveBeenCalledTimes(1);
 });

 it('game does not exist', async () => {
  getGameMock.mockImplementation(() => nonExistentGame);
  credentialsMock.mockImplementation(
      () => mockedUser);
  const wrapper = render(<WaitingRoom setAppLevelGameId={()=>undefined}/>);
  await waitForElement(() => wrapper.getByText("Could Not Find Game"));

 });

 it('game exists; loads elements', async () => {
  getGameMock.mockImplementation(() => mockedGame);
  credentialsMock.mockImplementation(
      () => mockedUser);
  let wrapper;
  await act(async () => {
   wrapper = render(<WaitingRoom setAppLevelGameId={()=>undefined}/>);
  });
  expect(wrapper.container.textContent).toContain("Game link");
  expect(wrapper.container.textContent).toContain(`join-game/${mockGameId}`);
  expect(wrapper.container.querySelectorAll("table")).toHaveLength(Object.keys(mockedGame.teams).length);
  expect(wrapper.container.querySelectorAll("table").item(0).textContent).toContain(Object.keys(mockedGame.teams)[0]);
  expect(wrapper.container.querySelectorAll("table").item(1).textContent).toContain(Object.keys(mockedGame.teams)[1]);

 }); });