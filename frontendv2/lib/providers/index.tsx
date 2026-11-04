"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WagmiProvider } from "wagmi";
import { AirkitProvider } from "./AirkitProvider";
import { config } from "./config"; // Import your manual config

// Create the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AirkitProvider>{children}</AirkitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
