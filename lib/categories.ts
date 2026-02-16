// maps items to their category for grouping
export const categoryMap: Record<string, string> = {
  milk: "Dairy",
  cheese: "Dairy",
  butter: "Dairy",
  yogurt: "Dairy",
  egg: "Dairy",

  banana: "Fruits",
  apple: "Fruits",
  orange: "Fruits",
  mango: "Fruits",
  grape: "Fruits",

  potato: "Vegetables",
  onion: "Vegetables",
  tomato: "Vegetables",
  carrot: "Vegetables",

  chips: "Snacks",
  biscuits: "Snacks",
  chocolate: "Snacks",

  bread: "Bakery",
  cake: "Bakery",

  rice: "Grains",
  wheat: "Grains",
};

// returns category for an item
export function getCategory(item: string): string {
  return categoryMap[item.toLowerCase()] || "Other";
}
