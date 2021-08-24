import axios from "axios";
import { AUTH_INFO, ADD_INFO } from "./type";
import { SERVER_INFO } from "../config";

export function authInfo() {
  const request = axios
    .get(`${SERVER_INFO}/auth`)
    .then((response) => response.data);

  return {
    type: AUTH_INFO,
    payload: request,
  };
}

export function addInfo(dataToSubmit) {
  const request = axios
    .post(`${SERVER_INFO}/addinfo`, dataToSubmit)
    .then((response) => response.data);
  return {
    type: ADD_INFO,
    payload: request,
  };
}
