export const categoryMap: Record<string, string> = {
  milk: "Dairy",
  cheese: "Dairy",
  butter: "Dairy",
  yogurt: "Dairy",

  banana: "Fruits",
  apple: "Fruits",
  orange: "Fruits",
  mango: "Fruits",

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

export function getCategory(item: string): string {
  return categoryMap[item.toLowerCase()] || "Other";
}

