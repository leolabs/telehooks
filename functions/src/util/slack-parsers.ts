import chunk from "lodash/chunk";
import { createLink, escape } from "./markdown";
import { MessageAttachment } from "@slack/types";
import {
  InlineKeyboardButton,
  InlineKeyboardMarkup,
} from "../types/telegram-api";

export const parseText = (att: MessageAttachment) => {
  const textLines: string[] = [];

  if (att.pretext) {
    textLines.push(att.pretext);
  }

  if (att.author_name) {
    textLines.push(createLink(att.author_name, att.author_link));
  }

  if (att.title) {
    textLines.push(
      att.title_link ? createLink(att.title, att.title_link) : `*${att.title}*`,
    );
  }

  if (att.text) {
    textLines.push(att.text);
  }

  if (att.fields) {
    textLines.push("");
    for (const field of att.fields) {
      textLines.push(`${escape(field.title)}`, field.value, "");
    }
  }

  if (att.footer) {
    textLines.push(att.footer);
  }

  return textLines.join("\n").trim();
};

export const parseButtons = (
  att: MessageAttachment,
): InlineKeyboardMarkup | undefined => {
  const actions = (att.actions || [])
    .filter(action => action.url)
    .map(
      action =>
        ({ text: action.text, url: action.url } as InlineKeyboardButton),
    );

  return actions.length ? { inline_keyboard: chunk(actions, 2) } : undefined;
};
