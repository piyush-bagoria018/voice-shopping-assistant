export type CommandIntent = "add" | "remove" | "search" | "unknown";

export interface ParsedCommand {
  intent: CommandIntent;
  item: string | null;
  quantity: number;
}

// maps spoken number words to actual numbers
const numberWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  एक: 1,
  दो: 2,
  तीन: 3,
  चार: 4,
  पांच: 5,
  छह: 6,
  सात: 7,
  आठ: 8,
  नौ: 9,
  दस: 10,
};

// words we want to filter out so only the item name remains
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
  "जोड़ो",
  "जोडो",
  "जोड़ों",
  "हटाओ",
  "हटाऔ",
  "निकालो",
  "निकालों",
  "खरीदो",
  "खरीदों",
  "चाहिए",
  "चाहिये",
  "खोजो",
  "खोजों",
  "ढूंढो",
  "ढूंढों",
  "ढूढो",
  "मेरी",
  "सूची",
  "में",
  "से",
  "को",
  "कृपया",
  "लिस्ट",
  "का",
  "की",
  "करो",
  "करों",
  "मुझे",
  "मैं",
  "ये",
  "वो",
  "है",
];

// this map converts those hindi words back to english item names
const hindiToEnglish: Record<string, string> = {
  सेब: "apple",
  केला: "banana",
  संतरा: "orange",
  दूध: "milk",
  रोटी: "bread",
  चावल: "rice",
  मक्खन: "butter",
  अंगूर: "grapes",
  आलू: "potato",
  प्याज: "onion",
  टमाटर: "tomato",
  पानी: "water",
  चीनी: "sugar",
  नमक: "salt",
  आम: "mango",
  अंडा: "egg",
  अंडे: "egg",
  पनीर: "paneer",
  दही: "curd",
  गेहूं: "wheat",
  दाल: "dal",
  एप्पल: "apple",
  एपल: "apple",
  ऐपल: "apple",
  बनाना: "banana",
  बनाने: "banana",
  ऑरेंज: "orange",
  ऑरेज: "orange",
  मिल्क: "milk",
  ब्रेड: "bread",
  राइस: "rice",
  बटर: "butter",
  ग्रेप्स: "grapes",
  ग्रेपस: "grapes",
  पोटेटो: "potato",
  अनियन: "onion",
  ऑनियन: "onion",
  टोमैटो: "tomato",
  चिप्स: "chips",
  वॉटर: "water",
  शुगर: "sugar",
  सॉल्ट: "salt",
  मैंगो: "mango",
  मेंगो: "mango",
  मैगो: "mango",
  एग: "egg",
  एग्स: "egg",
};

// converts item to a standard form
function normalizeItem(item: string | null): string | null {
  if (!item) return null;

  if (hindiToEnglish[item]) {
    return hindiToEnglish[item];
  }

  if (item.endsWith("s")) {
    return item.slice(0, -1);
  }
  return item;
}

// takes raw speech text and extracts intent, item name, and quantity
export function parseCommand(text: string): ParsedCommand {
  const lowerText = text
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .trim();

  let intent: CommandIntent = "unknown";

  if (
    lowerText.includes("add") ||
    lowerText.includes("buy") ||
    lowerText.includes("need") ||
    lowerText.includes("जोड़ो") ||
    lowerText.includes("जोडो") ||
    lowerText.includes("खरीदो") ||
    lowerText.includes("चाहिए") ||
    lowerText.includes("चाहिये")
  ) {
    intent = "add";
  } else if (
    lowerText.includes("remove") ||
    lowerText.includes("delete") ||
    lowerText.includes("हटाओ") ||
    lowerText.includes("हटाऔ") ||
    lowerText.includes("निकालो")
  ) {
    intent = "remove";
  } else if (
    lowerText.includes("find") ||
    lowerText.includes("search") ||
    lowerText.includes("show") ||
    lowerText.includes("खोजो") ||
    lowerText.includes("ढूंढो") ||
    lowerText.includes("ढूढो")
  ) {
    intent = "search";
  }

  let quantity = 1;

  // try to extract quantity
  if (lowerText.includes("all")) {
    quantity = Number.MAX_SAFE_INTEGER;
  } else {
    const quantityMatch = lowerText.match(/\d+/);
    if (quantityMatch) {
      quantity = parseInt(quantityMatch[0]);
    } else {
      const words = lowerText.split(" ");
      for (let word of words) {
        if (numberWords[word]) {
          quantity = numberWords[word];
          break;
        }
      }
    }
  }

  // remove stop words, numbers etc
  const cleanedWords = lowerText
    .split(" ")
    .filter(
      (word) =>
        !STOP_WORDS.includes(word) && !numberWords[word] && !/\d+/.test(word),
    );

  // pick the last remaining word as the item name
  const item = cleanedWords.length
    ? cleanedWords[cleanedWords.length - 1]
    : null;

  const invalidWords = ["and", "the", "a", "to", "for"];

  if (!item || invalidWords.includes(item)) {
    return {
      intent: "unknown",
      item: null,
      quantity: 0,
    };
  }
  if (!item || item.length < 2) {
    return {
      intent: "unknown",
      item: null,
      quantity: 0,
    };
  }

  return {
    intent,
    item: normalizeItem(item),
    quantity,
  };
}
