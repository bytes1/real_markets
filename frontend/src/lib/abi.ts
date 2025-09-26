import RealMarketFactory from "./RealMarketFactory.json";
import ReputationManager from "./ReputationManager.json";
import PredictionMarket from "./PredictionMarket.json";
import type { Abi } from "viem";
export const RealMarketFactoryABI = RealMarketFactory.abi as Abi;
export const ReputationManagerABI = ReputationManager.abi as Abi;
export const PredictionMarketABI = PredictionMarket.abi as Abi;

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
  },
] as Abi;
