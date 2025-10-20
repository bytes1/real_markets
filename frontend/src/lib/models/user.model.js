// src/lib/models/user.model.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    emailPref_dailyDigest: { type: Boolean, default: false },
    emailPref_newMarketAlerts: { type: Boolean, default: false },
    emailPref_tradeUpdates: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const User = model("RealMarketsUser", UserSchema);
