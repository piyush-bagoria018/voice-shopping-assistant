export type CommandIntent = "add" | "remove" | "search" | "unknown";

export interface ParsedCommand {
  intent: CommandIntent;
  item: string | null;
  quantity: number;
}

const STOP_WORDS = [
  "add",
  "remove",
  "delete",
  "buy",
  "need",
  "want",
  "to",
  "my",
  "list",
  "from",
  "the",
  "please",
];

function normalizeItem(item: string | null): string | null {
  if (!item) return null;

  if (item.endsWith("s")) {
    return item.slice(0, -1);
  }
  return item;
}

export function parseCommand(text: string): ParsedCommand {
  const lowerText = text
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .trim();

  let intent: CommandIntent = "unknown";

  if (
    lowerText.includes("add") ||
    lowerText.includes("buy") ||
    lowerText.includes("need")
  ) {
    intent = "add";
  } else if (lowerText.includes("remove") || lowerText.includes("delete")) {
    intent = "remove";
  } else if (
    lowerText.includes("find") ||
    lowerText.includes("search") ||
    lowerText.includes("show")
  ) {
    intent = "search";
  }

  const quantityMatch = lowerText.match(/\d+/);
  const quantity = quantityMatch ? parseInt(quantityMatch[0]) : 1;

  const words = lowerText.split(" ");
  const filteredWords = words.filter((word) => !STOP_WORDS.includes(word));

  const item = filteredWords.length
    ? filteredWords[filteredWords.length - 1]
    : null;

  return {
    intent,
    item: normalizeItem(item),
    quantity,
  };
}
