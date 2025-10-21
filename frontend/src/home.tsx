// File: real_markets/frontend/src/home.tsx

import { HeroSection } from "./components/HeroSection";
import { MarketsPage } from "./components/MarketsPage";
import { ExclusiveMarkets } from "./components/ExclusiveMarkets";
// WalletBalanceCard import is removed as requested
import ChatInterface from "./components/chatbot/ChatInterface";
import { FollowerMarkets } from "./components/FollowerMarkets";
import type { Market } from "@/lib/types";

export default function Home() {
  return (
    // 2. This outer div must contain all your page content
    <div className="container mx-auto p-4">
      {/* 3. These are your original page components */}
      <HeroSection />

      <MarketsPage />
      <ExclusiveMarkets />
      <FollowerMarkets />

      {/* 4. The chatbot is ADDED here, at the same level */}
      <ChatInterface />
    </div>
  );
}
