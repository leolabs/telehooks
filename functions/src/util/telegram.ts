import * as firebase from "firebase-functions";
import { SendMessageParams } from "../types/telegram-api";
import got = require("got");

export const DEFAULT_KEY: string = firebase.config().telegram.key;
export const API_URL = `https://api.telegram.org`;

export const sendMessage = async (body: SendMessageParams, key = DEFAULT_KEY) =>
  got.post(`${API_URL}/bot${key}/sendMessage`, { body, json: true });
