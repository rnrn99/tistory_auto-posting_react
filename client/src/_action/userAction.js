import axios from "axios";
import { AUTH_USER, LOGIN_USER, REGISTER_USER, LOGOUT_USER } from "./type";
import { SERVER_USER } from "../config";

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${SERVER_USER}/login`, dataToSubmit)
    .then((response) => response.data);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${SERVER_USER}/register`, dataToSubmit)
    .then((response) => response.data);
  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function authUser() {
  const request = axios
    .get(`${SERVER_USER}/auth`)
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios
    .get(`${SERVER_USER}/logout`)
    .then((response) => response.data);
  return {
    type: LOGOUT_USER,
    payload: request,
  };
}
