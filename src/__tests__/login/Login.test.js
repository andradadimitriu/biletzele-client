import React from 'react';
import { Auth } from 'aws-amplify';
import {shallow} from "enzyme";
import Login from "../../login/Login";
import {fireEvent, render} from "@testing-library/react";
import LoginForm from "../../login/LoginForm";
import * as context from "../../libs/contextLib";

const logInMock = jest.spyOn(Auth, "signIn");
const contextMock = jest.spyOn(context, "useAppContext");


describe('<Login/> tests', () => {

 it('Loads the LoginForm first', () => {
  const wrapper = shallow(<Login/>);
  expect(wrapper.find('LoginForm')).toHaveLength(1);
  expect(wrapper.find('Confirm')).toHaveLength(0);
 });

 it('confirmation screen is loaded when user not confirmed', async() => {
  const loginErr = new Error();
  loginErr.code = "UserNotConfirmedException";
  logInMock.mockImplementation(() =>  {
   throw loginErr;
  });
  contextMock.mockImplementation(() =>({ userHasAuthenticated: ()=>false}));
  const {container} = render(<Login/>);
  const loginForm = container.querySelector("form");
  fireEvent.submit(loginForm);
  expect(container.textContent).toContain("Confirmation Code");

})

});

