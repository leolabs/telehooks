import * as firebase from "firebase-functions";
import { stripIndents, oneLine } from "common-tags";
import { sendMessage, DEFAULT_KEY } from "./util/telegram";
import { hash } from "./util/hash";
import { TelegramWebhook } from "./types/telegram-webhook";
import { escape } from "./util/markdown";

const HOOK_URL = firebase.config().telehooks.url;

const hookUrl = (chatId: string | number) =>
  `${HOOK_URL}/${chatId}/${hash(String(chatId))}`;

const aboutText = stripIndents`
  ${oneLine`If you want to use your own bot with Telehooks, that's possible as well.
  Create a new bot by asking @BotFather if you haven't already, then head
  over to my homepage to generate a webhook URL.`}

  ${oneLine`If you have any questions or suggestions, feel free to contact my maker
  on Twitter [@leolabs_org](https://twitter.com/leolabs_org) or visit his homepage,
  [leolabs.org](https://leolabs.org).`}

  ${oneLine`Telehooks is completely open-source. You can access my source code on
  [GitHub](https://github.com/leolabs/telehooks).`}

  ${oneLine`Please consider supporting the development and costs of Telehooks by
  sponsoring it on [Open Collective](https://opencollective.com/telehooks)
  if you like it.`}
`;

export const telegramUpdate = firebase.https.onRequest(async (req, res) => {
  const { message } = req.body as TelegramWebhook;

  if (!message) {
    return;
  }

  if (!req.query.key || req.query.key !== DEFAULT_KEY.slice(-10)) {
    console.error(
      "Key mismatch. Given:",
      req.query.key,
      "expected:",
      DEFAULT_KEY.slice(-10),
    );
    return res.status(401).json({ error: "Key mismatch" });
  }

  if (
    message.text === "/start" &&
    message.chat.type === "private" &&
    message.chat.id
  ) {
    const text = stripIndents`
      Hey ${message.from.first_name}!

      ${oneLine`I'm the Telehooks bot. Add me to any group that you want to integrate
      Slack Webhooks into. You'll receive further instructions once you've added me.`}

      You can also send webhooks to this chat, if you prefer. Just use this URL:

      \`${hookUrl(message.chat.id)}\`

      ${aboutText}
    `;

    await sendMessage({
      chat_id: message.chat.id,
      text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Customize Hook",
              url: hookUrl(message.chat.id),
            },
          ],
        ],
      },
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

    return res.json({ success: true });
  }

  if (
    message.group_chat_created ||
    (message.new_chat_member &&
      message.new_chat_member.username === "TelehooksBot")
  ) {
    const dmText = stripIndents`
      Hey ${message.from.first_name}!

      You've just added me to ${
        message.chat.title
          ? `the group *${escape(message.chat.title)}*`
          : "a group"
      }.

      Here's your webhook URL:

      \`${hookUrl(message.chat.id)}\`
    `;

    const dmRes = await sendMessage({
      chat_id: message.from.id,
      text: dmText,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Customize Hook",
              url: hookUrl(message.chat.id),
            },
          ],
        ],
      },
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

    if (!dmRes.body.ok) {
      const errorText = stripIndents`
        Hey there!

        Thanks for adding me to your group! 🎉
        ${oneLine`I couldn't send you the webhook URL as a private message because
        you've never messaged me privately before. Please do that first and then
        add me to this group again.`}
      `;

      await sendMessage({
        chat_id: message.chat.id,
        text: errorText,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
      return res.json({ success: true });
    }

    const text = stripIndents`
      Hey there!

      Thanks for adding me to your group! 🎉
      I've sent you the webhook URL as a direct message.
    `;

    await sendMessage({
      chat_id: message.chat.id,
      text,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

    return res.json({ success: true });
  }

  return;
});
