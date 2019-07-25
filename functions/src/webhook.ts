import * as firebase from "firebase-functions";
import express from "express";
import bodyParser from "body-parser";
import { IncomingWebhookSendArguments } from "@slack/webhook";
import { sendMessage } from "./util/telegram";
import { parseText, parseButtons } from "./util/slack-parsers";

const app = express();
const DEFAULT_KEY = firebase.config().telegram.key;

app.use(bodyParser.json());

app.get("*", (req, res) => {
  res.redirect(`https://telehooks.dev/#${req.url.substr(1)}`);
});

app.post("/:chatId/:key?", async (req, res) => {
  const chatId = req.params.chatId;
  const key = req.params.key || DEFAULT_KEY;
  const body: IncomingWebhookSendArguments = req.body;

  if (!chatId) {
    res.status(400).json({ error: "Chat ID is not set" });
    return;
  }
  const debugUrl = `https://api.slack.com/docs/messages/builder?msg=${encodeURIComponent(
    JSON.stringify(req.body),
  )}`;

  const text =
    (body.text ? `${body.text}\n\n` : "") +
    (body.attachments ? parseText(body.attachments[0]) : "") +
    (Object.keys(req.query).includes("debug")
      ? `\n\n[(View Original Message)](${debugUrl})`
      : "");

  if (!text) {
    res.status(400).json({ error: "The message is empty." });
  }

  await sendMessage(
    {
      chat_id: chatId,
      text,
      reply_markup: body.attachments
        ? parseButtons(body.attachments[0])
        : undefined,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    },
    key,
  );

  if (body.attachments && body.attachments.length > 1) {
    for (const att of body.attachments.slice(1)) {
      await sendMessage(
        {
          chat_id: chatId,
          text: parseText(att),
          reply_markup: parseButtons(att),
          parse_mode: "Markdown",
          disable_notification: true,
          disable_web_page_preview: true,
        },
        key,
      );
    }
  }

  res.status(204).send();
});

export const webhook = firebase.https.onRequest(app);
