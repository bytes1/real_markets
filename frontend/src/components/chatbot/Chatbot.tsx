"use client";

import { useState } from "react";
// MODIFIED: Use relative path for components in real_markets
import { Button } from "../ui/button";
import { MessageSquare, X } from "lucide-react";
import ChatInterface from "./ChatInterface";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* The Chat Window */}
      {isOpen && (
        <div className="mb-4">
          {/* MODIFIED: Removed onClose prop, as the original ChatInterface handles this internally */}
          <ChatInterface />
        </div>
      )}

      {/* The Toggle Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="rounded-full h-16 w-16 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isOpen ? (
            <X className="h-8 w-8" />
          ) : (
            <MessageSquare className="h-8 w-8" />
          )}
        </Button>
      </div>
    </div>
  );
}
