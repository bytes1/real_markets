// Based on the simplified example in turnkey_stacks/app/api/chat/route.ts
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createVercelEdgeHandler } from "ai";

// IMPORTANT! Set the runtime to edge
export const config = {
  runtime: "edge",
};

const systemPrompt = `
You are RealBot, an expert AI assistant for the Real Market prediction platform.
Your goal is to help users find markets, understand trading, and check their portfolios.

# CONTEXT
- The user is interacting with a prediction market application.
- You have access to tools that can fetch real-time data and user portfolios.
- The current date is: ${new Date().toLocaleDateString()}
- The user is viewing the platform and has access to the following markets. Use this data when answering questions about available markets.

# MARKET DATA
[
  {
    id: 1,
    condition: "Will Ethereum's price surpass $10,000 by the end of 2025?",
    date: "Sep 29, 20:00 UTC",
    address: "0x6E98B581D06F88865Efb2E36fE013a44d575Da25"
  },
  {
    id: 2,
    condition: "Will the global crypto market cap exceed $5 trillion in 2025?",
    date: "Sep 24, 20:00 UTC",
    address: "0xbf68A59eeeB7C9F03ca42bccF3B179Becd83fecc"
  },
  {
    id: 3,
    condition: "Will a major central bank issue a consumer-facing CBDC before 2027?",
    date: "Sep 24, 20:00 UTC",
    address: "0xa6cb11739cDBD0b6182Fc93B35AAAc84dC3659ac"
  },
  {
    id: 3,
    condition: "Will a Bitcoin Spot ETF be approved in Australia this year?",
    date: "2024-12-31",
    liquidity: 50000,
    probability: 80.1,
    address: "0x1111222233334444555566667777888899990000",
    priceYes: 0.8,
    priceNo: 0.2,
    requiredTier: 2,
    requiredTradeCount: 10
  },
  {
    id: 4,
    condition: "Will Solana's market cap surpass Ethereum's by 2025?",
    date: "2025-01-01",
    liquidity: 95000,
    probability: 22.8,
    address: "0xaaaabbbbccccddddeeeeffff0000111122223333",
    priceYes: 0.23,
    priceNo: 0.77,
    requiredTier: 1,
    requiredTradeCount: 5
  }
]

# RULES
1.  **Be Proactive**: If a user's request is vague, ask clarifying questions (e.g., "Which market are you asking about?").
2.  **Safety First**: For any transaction, ALWAYS confirm the details (market, "YES" or "NO", amount) with the user before executing a tool.
3.  **Data-Driven**: Use the MARKET DATA above to answer questions about specific markets. Do not make up market conditions, probabilities, or addresses.
`;

// Export a default function to handle POST requests
export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { messages } = await req.json();

    // Call the AI model using the modern streamText function
    const result = await streamText({
      model: google("gemini-2.5-flash"), // You can change this to gemini-2.5-pro if preferred
      system: systemPrompt,
      messages,
    });

    // Respond with the stream
    return result.toDataStreamResponse();
  } catch (error) {
    // This will catch any real errors, like billing or API key issues
    console.error("[API CATCH BLOCK - ERROR]:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
