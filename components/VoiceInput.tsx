"use client";

import { useState, useRef } from "react";
import { ParsedCommand, parseCommand } from "@/lib/parser";

// supported languages for speech recognition
const LANGUAGES = [
  { code: "en-US", label: "🇺🇸 English" },
  { code: "hi-IN", label: "🇮🇳 Hindi" },
];

interface Props {
  onCommand: (command: ParsedCommand) => void;
}

export default function VoiceInput({ onCommand }: Props) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    // browser speech api
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);

      // parse the spoken text
      const parsed = parseCommand(transcript);
      onCommand(parsed);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              language === lang.code
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <button
        onClick={toggleListening}
        className={`px-5 py-2 rounded-full text-white text-sm transition ${
          isListening ? "bg-red-500 animate-pulse" : "bg-black"
        }`}
      >
        {isListening ? "🛑 Stop Listening" : "🎤 Start Speaking"}
      </button>

      {text && (
        <div className="bg-gray-100 p-2 rounded-lg w-full text-center text-sm">
          {text}
        </div>
      )}
    </div>
  );
}
