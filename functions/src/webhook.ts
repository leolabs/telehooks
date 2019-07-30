import * as firebase from "firebase-functions";
import express from "express";
import bodyParser from "body-parser";
import { sendMessage } from "./util/telegram";
import { services } from "./services/";
import { hash } from "./util/hash";

const app = express();
const DEFAULT_KEY = firebase.config().telegram.key;

app.use(bodyParser.json());

app.get("*", (req, res) => {
  res.redirect(`https://telehooks.dev/#${req.url.substr(1)}`);
});

app.post("/:chatId/:key/:service?", async (req, res) => {
  const chatId = req.params.chatId;
  const key =
    req.params.key && req.params.key.length !== 8
      ? req.params.key
      : DEFAULT_KEY;
  const body: IncomingWebhookSendArguments = req.body;
  const service = req.params.service || "slack";

  if (!chatId) {
    res.status(400).json({ error: "Chat ID is not set" });
    return;
  }

  if (
    req.params.key &&
    req.params.key.length === 8 &&
    hash(chatId) !== req.params.key
  ) {
    res.status(400).json({ error: "The provided signature is incorrect." });
    return;
  }

  if (!Object.keys(services).includes(service)) {
    res.status(400).json({ error: `The service "${service}" is unknown` });
    return;
  }

  try {
    const messages = await services[service].parser(req.body, req.query, req);

    for (const message of messages) {
      const text =
        (req.query.prepend ? `${req.query.prepend}\n` : "") +
        message.text +
        (req.query.append ? `\n${req.query.append}` : "");

      await sendMessage(
        { ...message, text, chat_id: chatId, parse_mode: "Markdown" },
        key,
      );
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export const webhook = firebase.https.onRequest(app);
