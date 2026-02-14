"use client";

import { useState, useRef } from "react";
import { ParsedCommand, parseCommand } from "@/lib/parser";

interface Props {
    onCommand: (command: ParsedCommand) => void;
}

export default function VoiceInput({onCommand}: Props) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
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
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);

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
    <div className="flex flex-col gap-4 items-center">
      <button
        onClick={toggleListening}
        className={`px-6 py-3 rounded-full text-white transition ${
          isListening ? "bg-red-500 animate-pulse" : "bg-black"
        }`}
      >
        {isListening ? "🛑 Stop Listening" : "🎤 Start Speaking"}
      </button>

      {text && (
        <div className="bg-gray-100 p-3 rounded-lg w-full text-center">
          {text}
        </div>
      )}
    </div>
  );
}
