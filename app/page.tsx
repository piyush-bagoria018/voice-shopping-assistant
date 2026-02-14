"use client";

import { useState, useEffect } from "react";
import VoiceInput from "@/components/VoiceInput";
import { ParsedCommand } from "@/lib/parser";

interface Item {
  name: string;
  quantity: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("shopping-items");

    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

  const handleCommand = (command: ParsedCommand) => {
    if (!command.item) return;

    if (command.intent === "add") {
      setItems((prev) => {
        const existing = prev.find((i) => i.name === command.item);

        if (existing) {
          return prev.map((i) =>
            i.name === command.item
              ? { ...i, quantity: i.quantity + command.quantity }
              : i,
          );
        }

        return [
          ...prev,
          {
            name: command.item!,
            quantity: command.quantity,
          },
        ];
      });
    }

    if (command.intent === "remove") {
      setItems(
        (prev) =>
          prev
            .map((item) => {
              if (item.name !== command.item) return item;

              const newQty = item.quantity - command.quantity;

              if (newQty <= 0) return null;

              return {
                ...item,
                quantity: newQty,
              };
            })
            .filter(Boolean) as Item[],
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Voice Shopping Assistant
        </h1>

        <VoiceInput onCommand={handleCommand} />

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Shopping List</h2>

          {items.length === 0 && (
            <p className="text-gray-400 text-sm">No items added yet</p>
          )}

          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between bg-gray-50 p-2 rounded mb-2"
            >
              <div>
                <p className="text-xs text-gray-400">Item</p>
                <p className="font-medium">{item.name}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Qty</p>
                <p className="font-medium">{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
