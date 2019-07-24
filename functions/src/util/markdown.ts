const replacements: [RegExp, string][] = [
  [/\*/g, "\\*"],
  [/#/g, "\\#"],
  [/\//g, "\\/"],
  [/\(/g, "\\("],
  [/\)/g, "\\)"],
  [/\[/g, "\\["],
  [/\]/g, "\\]"],
  [/\</g, "&lt;"],
  [/\>/g, "&gt;"],
  [/_/g, "\\_"],
];

export const escape = (input: string) =>
  replacements.reduce(
    (string, replacement) => string.replace(replacement[0], replacement[1]),
    input,
  );

export const createLink = (title: string, link?: string) =>
  link ? `[${escape(title)}](${link.replace(")", "\\)")})` : title;
