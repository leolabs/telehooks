import { Service, ServiceParser, ParserOutput } from "..";
import { IncomingWebhookSendArguments } from "@slack/webhook";
import { parseText, parseButtons } from "./parsers";

const MSG_BUILDER = "https://api.slack.com/docs/messages/builder";

const parser: ServiceParser = async (
  input: IncomingWebhookSendArguments,
  settings,
) => {
  const debugUrl = `${MSG_BUILDER}?msg=${encodeURIComponent(
    JSON.stringify(input),
  )}`;

  const text =
    (input.text ? `${input.text}\n\n` : "") +
    (input.attachments ? parseText(input.attachments[0]) : "") +
    (Object.keys(settings).includes("debug")
      ? `\n\n[(View Original Message)](${debugUrl})`
      : "");

  if (!text) {
    throw new Error("The message is empty.");
  }

  const messages: ParserOutput = [
    {
      text,
      reply_markup: input.attachments
        ? parseButtons(input.attachments[0])
        : undefined,
      disable_web_page_preview: true,
    },
  ];

  if (input.attachments && input.attachments.length > 1) {
    for (const att of input.attachments.slice(1)) {
      messages.push({
        text: parseText(att),
        reply_markup: parseButtons(att),
        disable_notification: true,
        disable_web_page_preview: true,
      });
    }
  }

  return messages;
};

export const slack: Service = {
  name: "Slack",
  parser,
};
