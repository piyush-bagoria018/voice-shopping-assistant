"use client";

import { useState, useEffect, useMemo } from "react";
import VoiceInput from "@/components/VoiceInput";
import { ParsedCommand } from "@/lib/parser";
import { getSuggestions } from "@/lib/suggestions";
import { getCategory } from "@/lib/categories";
import toast from "react-hot-toast";
import { Trash2, Pencil, Search, X } from "lucide-react";

interface Item {
  name: string;
  quantity: number;
  category: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("shopping-items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

  const groupedItems = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, Item[]>,
    );
  }, [items]);

  const filteredGroupedItems = useMemo(() => {
    if (!searchQuery) return groupedItems;

    const filtered: Record<string, Item[]> = {};

    Object.entries(groupedItems).forEach(([category, categoryItems]) => {
      const matched = categoryItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matched.length > 0) {
        filtered[category] = matched;
      }
    });

    return filtered;
  }, [groupedItems, searchQuery]);

  const handleCommand = (command: ParsedCommand) => {
    if (!command.item) return;

    if (command.intent === "search") {
      setSearchQuery(command.item);
      toast.success(`Searching for "${command.item}"...`);
      return;
    }

    setSearchQuery("");

    if (command.intent === "add") {
      const suggestionList = getSuggestions(command.item);
      setSuggestions(suggestionList);

      const existing = items.find((i) => i.name === command.item);
      if (existing) {
        toast.success(`Updated ${command.item} quantity!`);
      } else {
        toast.success(`Added ${command.quantity} ${command.item}!`);
      }

      setItems((prev) => {
        const existingItem = prev.find((i) => i.name === command.item);

        if (existingItem) {
          return prev.map((i) =>
            i.name === command.item
              ? { ...i, quantity: i.quantity + command.quantity }
              : i,
          );
        }

        const category = getCategory(command.item!);

        return [
          ...prev,
          {
            name: command.item as string,
            quantity: command.quantity,
            category,
          },
        ];
      });
    }

    if (command.intent === "remove") {
      toast.success(`Removed ${command.item}!`);
      setItems(
        (prev) =>
          prev
            .map((item) => {
              if (item.name !== command.item) return item;
              if (command.quantity >= item.quantity) {
                return null;
              }
              return {
                ...item,
                quantity: item.quantity - command.quantity,
              };
            })
            .filter(Boolean) as Item[],
      );
    }
  };

  const handleDelete = (name: string) => {
    setItems((prev) => prev.filter((item) => item.name !== name));
    toast.success(`Deleted ${name}!`);
  };

  const handleEdit = (name: string) => {
    const newQty = prompt("Enter new quantity:");
    if (!newQty) return;

    const quantity = parseInt(newQty);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.name === name ? { ...item, quantity } : item)),
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-5">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Voice Shopping Assistant
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your shopping list using voice commands.
          </p>
        </header>

        <section className="mb-8 bg-white border border-gray-200 rounded-md p-6">
          <VoiceInput onCommand={handleCommand} />
        </section>

        {suggestions.length > 0 && (
          <section className="mb-8">
            <p className="text-sm text-gray-500 mb-3">You may also need:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() =>
                    handleCommand({ intent: "add", item: s, quantity: 1 })
                  }
                  className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mb-6">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search items... or say "Find apples'
              className="w-full border border-gray-200 rounded-md pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Shopping List
              {searchQuery && (
                <span className="text-sm font-normal text-gray-400 ml-2">
                  — results for "{searchQuery}"
                </span>
              )}
            </h2>
            {items.length > 0 && (
              <button
                onClick={() => {
                  setItems([]);
                  setSuggestions([]);
                  toast.success("List cleared!");
                }}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {items.length === 0 && (
            <p className="text-gray-400 text-sm">
              No items yet. Try saying "Add 2 milk"
            </p>
          )}

          {items.length > 0 &&
            searchQuery &&
            Object.keys(filteredGroupedItems).length === 0 && (
              <p className="text-gray-400 text-sm">
                No items found for "{searchQuery}"
              </p>
            )}

          <div className="max-h-[50vh] overflow-y-auto space-y-6 pr-2">
            {Object.entries(filteredGroupedItems).map(
              ([category, categoryItems]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item.name)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.name)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
