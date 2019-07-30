import { SendMessageParams } from "../types/telegram-api";

import { slack } from "./slack";

export type ParserOutput = Omit<SendMessageParams, "chat_id">[];

export interface DefaultSettings {
  debug?: boolean;
  prepend?: string;
  append?: string;
}

export type ServiceParser = (
  input: any,
  settings: { [k: string]: string },
) => Promise<ParserOutput>;

export interface Service {
  name: string;
  parser: ServiceParser;
}

export const services: { [k: string]: Service } = {
  slack,
};
