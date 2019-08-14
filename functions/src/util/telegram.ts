import * as firebase from "firebase-functions";
import { SendMessageParams, Response } from "../types/telegram-api";
import got from "got";

export const DEFAULT_KEY: string = firebase.config().telegram.key;
export const API_URL = `https://api.telegram.org`;

export const sendMessage = async (
  body: SendMessageParams,
  key = DEFAULT_KEY,
): Promise<got.GotPromise<Response>> =>
  got.post(`${API_URL}/bot${key}/sendMessage`, { body, json: true });
