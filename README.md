# Voice Shopping Assistant

A voice-powered shopping list app built with Next.js. Users can add, remove, and search items using voice commands in English and Hindi.

## Features

- **Voice Commands** — Add, remove, and search items by speaking naturally (e.g., "Add 2 milk", "Remove apple")
- **Hindi Support** — Switch to Hindi and use commands like "दो सेब जोड़ो" (add 2 apples)
- **Auto Categorization** — Items are automatically grouped into categories (Dairy, Fruits, Vegetables, etc.)
- **Smart Suggestions** — After adding an item, related items are suggested (e.g., add milk → suggests bread, butter)
- **Voice Search** — Say "Find apple" or type in the search bar to filter your list
- **Quantity Management** — Supports numeric digits and spoken number words ("two", "तीन")
- **Persistent Storage** — Shopping list is saved in localStorage across sessions
- **Toast Notifications** — Visual feedback for every action

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Web Speech API** (browser-native, no external NLP service)
- **react-hot-toast** (notifications)
- **lucide-react** (icons)

## Project Structure

```
app/
  layout.tsx        → root layout with toast provider
  page.tsx          → main page with shopping list UI
components/
  VoiceInput.tsx    → mic button, language selector, speech recognition
lib/
  parser.ts         → parses voice text into intent, item, and quantity
  categories.ts     → maps items to categories
  suggestions.ts    → maps items to related suggestions
```

## How the Parser Works

1. Speech API converts voice to text
2. `parseCommand()` processes the text:
   - Detects **intent** by matching keywords (add/buy/जोड़ो → "add", remove/हटाओ → "remove", find/खोजो → "search")
   - Extracts **quantity** from digits or number words (English + Hindi)
   - Filters out stop words to isolate the **item name**
   - Normalizes the item (Hindi → English translation, plural → singular)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge (required for Speech API support).

## Voice Commands Examples

| Command | Action |
|---|---|
| "Add 2 milk" | Adds milk with quantity 2 |
| "Buy apples" | Adds apple with quantity 1 |
| "Remove bread" | Removes bread from list |
| "Find orange" | Filters list to show orange |
| "दो सेब जोड़ो" | Adds 2 apple (Hindi) |
| "दूध हटाओ" | Removes milk (Hindi) |

## Deployment

Deployed on Vercel — [Live URL]

---

## Approach (Write-up)

I built this as a client-side Next.js application using the browser's Web Speech API for voice recognition. The core idea was to keep things simple — no backend, no external NLP service — just a custom parser that extracts intent, quantity, and item name from spoken text.

The parser works by matching keywords to determine what the user wants (add, remove, or search), extracting quantity from digits or spoken number words, then filtering out stop words to isolate the item name. For Hindi support, I set the Speech API's language property to `hi-IN` and added a translation map that converts Devanagari text (both pure Hindi words and transliterated English) back to English item names.

Items are automatically categorized using a predefined map and grouped in the UI using `useMemo` for performance. The shopping list persists in `localStorage` so it survives page refreshes. I also added a suggestion system that recommends related items after adding something.

I prioritized a clean, functional UI with real-time feedback (toast notifications) over trying to implement every possible feature. The focus was on making the core voice interaction work reliably in both languages.
