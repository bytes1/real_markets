import type { VercelRequest, VercelResponse } from "@vercel/node";
import dbConnect from "../src/lib/dbConnect.js"; // Add .js extension
import { User } from "../src/lib/models/user.model.js"; // Add .js extension
import { inngest } from "../src/lib/inngest/client.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`--- [${req.method}] /api/user ---`);

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  console.log(`--- [${req.method}] /api/user ---`);

  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected");

    if (req.method === "GET") {
      const { walletAddress } = req.query;

      if (!walletAddress || typeof walletAddress !== "string") {
        return res.status(400).json({ message: "Wallet address required" });
      }

      console.log(`Finding user: ${walletAddress}`);
      const user = await User.findOne({
        walletAddress: walletAddress.toLowerCase(),
      }).lean();

      if (!user) {
        return res.status(200).json({
          walletAddress: walletAddress.toLowerCase(),
          username: "",
          email: "",
          emailPref_dailyDigest: false,
          emailPref_newMarketAlerts: false,
          emailPref_tradeUpdates: false,
        });
      }

      return res.status(200).json(user);
    }

    if (req.method === "POST") {
      const { walletAddress, username, email, emailPreferences } = req.body;
      await inngest.send({
        name: "app/email-updated",
        data: {
          email,
          username,
          emailPreferences,
          walletAddress,
        },
      });

      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address required" });
      }

      const updateData: any = {};
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (emailPreferences) {
        updateData.emailPref_dailyDigest =
          emailPreferences.dailyDigest ?? false;
        updateData.emailPref_newMarketAlerts =
          emailPreferences.newMarketAlerts ?? false;
        updateData.emailPref_tradeUpdates =
          emailPreferences.tradeUpdates ?? false;
      }

      const updatedUser = await User.findOneAndUpdate(
        { walletAddress: walletAddress.toLowerCase() },
        { $set: updateData },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();

      return res.status(200).json(updatedUser);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
