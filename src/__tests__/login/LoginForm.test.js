import React from 'react';
import { Auth } from 'aws-amplify';
import {act, fireEvent, render, screen} from "@testing-library/react";
import LoginForm from "../../login/LoginForm";
import * as context from "../../libs/contextLib";
import  {faLib} from "../mocks/fontawesomeMocks";

const signInMock = jest.spyOn(Auth, "signIn");
const contextMock = jest.spyOn(context, "useAppContext");

describe('<LoginForm/> tests', () => {

 it('updating form works correctly', async() => {
  signInMock.mockImplementation(() =>  true);
  contextMock.mockImplementation(() =>({ userHasAuthenticated: false}));
  const email = 'email@gmail.com';
  const password = 'pass';
  const {getByLabelText} = render(<LoginForm/>);
  const emailInput = getByLabelText(/Email/i);
  const passwordInput = getByLabelText(/Password/i);
  expect(emailInput.value).toBe("");
  expect(passwordInput.value).toBe("");
  fireEvent.change(emailInput, {target: {value:  email} } );
  fireEvent.change(passwordInput, {target: {value: password } } );
  expect(emailInput.value).toBe(email);
  expect(passwordInput.value).toBe(password);
 });

 it('submitting form attempts to sign you in with the provided details', async() => {
  signInMock.mockImplementation(() =>  true);
  contextMock.mockImplementation(() =>({ userHasAuthenticated: ()=>true}));
  const email = 'email@gmail.com';
  const password = 'pass';
  const {getByLabelText, container} = render(<LoginForm/>);
  const emailInput = getByLabelText(/Email/i);
  const passwordInput = getByLabelText(/Password/i);
  fireEvent.change(emailInput, {target: {value:  email} } );
  fireEvent.change(passwordInput, {target: {value: password } } );
  const loginForm = container.querySelector("form");
  fireEvent.submit(loginForm);
  expect(signInMock).toHaveBeenCalledWith(email, password);
 });
});

