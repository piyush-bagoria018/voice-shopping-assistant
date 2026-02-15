export const suggestionMap: Record<string, string[]> = {
  milk: ["bread", "butter"],
  bread: ["butter", "jam"],
  banana: ["apple", "orange"],
  rice: ["wheat", "dal"],
  chips: ["cold drink"],
};


export function getSuggestions(item: string): string[] {
  return suggestionMap[item.toLowerCase()] || [];
}
