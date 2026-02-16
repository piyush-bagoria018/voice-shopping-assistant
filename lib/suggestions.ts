// when user adds an item, suggest related items they might also need
export const suggestionMap: Record<string, string[]> = {
  milk: ["bread", "butter"],
  bread: ["butter", "jam"],
  banana: ["apple", "orange"],
  apple: ["banana", "orange", "grapes"],
  rice: ["wheat", "dal"],
  chips: ["cold drink"],
  orange: ["apple", "banana"],
  butter: ["bread", "milk"],
};

export function getSuggestions(item: string): string[] {
  return suggestionMap[item.toLowerCase()] || [];
}
