import * as firebase from "firebase-functions";
import { stripIndents, oneLine } from "common-tags";
import { sendMessage, DEFAULT_KEY } from "./util/telegram";

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
  const { message } = req.body;

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

      \`https://telehooks.dev/hook/${message.chat.id}\`

      ${aboutText}
    `;

    await sendMessage({
      chat_id: message.chat.id,
      text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Visit Telehooks Homepage",
              url: "https://telehooks.dev/",
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
    const text = stripIndents`
      Hey there!

      Thanks for adding me to your group! 🎉

      Here's your Webhook URL:
      \`https://telehooks.dev/hook/${message.chat.id}\`

      You can use this URL with every service that accepts a Slack Webhook URL. To
      learn more and to customize the webhook, please visit my homepage.

      ${aboutText}
    `;

    await sendMessage({
      chat_id: message.chat.id,
      text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Visit Telehooks Homepage",
              url: `https://telehooks.dev/edit/${message.chat.id}`,
            },
          ],
        ],
      },
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

    return res.json({ success: true });
  }

  return res.json({ success: true });
});
