import { Service, ServiceParser, DefaultSettings } from "..";
import { Event } from "./types";
import { escape } from "../../util/markdown";
import { Request } from "express";

interface Settings extends DefaultSettings {
  events?: string;
}

const title = ({ Metadata }: Event) =>
  `*${escape(Metadata!.title!)}*` +
  (Metadata!.grandparentTitle ? ` (${Metadata!.grandparentTitle})` : "");

const supportedEvents: { [k: string]: (i: Event) => string } = {
  "library.new": (i: Event) => `✨ ${title(i)} has been added to your library.`,
  "library.on.deck": (i: Event) => `✨ ${title(i)} is now on deck.`,

  "media.play": (i: Event) =>
    `▶️ *${escape(i.Account!.title!)}* started watching ${title(i)}.`,
  "media.rate": (i: Event) =>
    `⭐️ *${escape(i.Account!.title!)}* rated ${title(i)} ${i.rating}/10`,
  "media.scrobble": (i: Event) =>
    `✅ *${escape(i.Account!.title!)}* finished ${title(i)}`,

  "admin.database.backup": (i: Event) =>
    `💾 *${i.Server!.title}* finished backing up`,
  "admin.database.corrupted": (i: Event) =>
    `❗️ *${i.Server!.title}* detected a database corruption`,
};

const parseMultipart = (req: Request, index = 1) => {
  if (
    !req.headers["content-type"] ||
    req.headers["content-type"].split(";")[0] !== "multipart/form-data"
  ) {
    return null;
  }

  const boundaryMatch = req.headers["content-type"].match(/.*boundary=(.*)/);

  if (!boundaryMatch) {
    return null;
  }

  const body = String(req.body).split(boundaryMatch[1]);
  const jsonMatch = body[index].match(/(\{.+\})./s);

  if (!jsonMatch) {
    return null;
  }

  return JSON.parse(jsonMatch[1]);
};

const parser: ServiceParser = async (
  input: Event,
  { events }: Settings,
  req,
) => {
  const parsedInput = parseMultipart(req) || input;

  if (!parsedInput.event) {
    throw new Error("Body is malformed. Event field is missing.");
  }

  const watchedEvents: (keyof typeof supportedEvents)[] = events
    ? (events.split(",") as any)
    : ["library.new", "admin.database.corrupted"];

  if (
    !Object.keys(supportedEvents).includes(parsedInput.event) ||
    !watchedEvents.includes(parsedInput.event)
  ) {
    return null;
  }

  return [
    {
      text: supportedEvents[parsedInput.event](parsedInput),
    },
  ];
};

export const plex: Service = {
  name: "Plex",
  parser,
};
