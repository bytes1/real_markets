# 🪙 TrueMarket Protocol – Smart Contracts

This directory contains the core smart contracts for the TrueMarket Protocol, a **reputation-based prediction market** built on the Moca Network.

---

## 📖 Contracts

### **ReputationManager.sol**

- Handles **user registration** with **proof-of-personhood**.
- Stores and updates **on-chain reputation scores** for all users.
- Only authorized protocol contracts can update reputation.

### **PredictionMarket.sol**

- Engine for a single **binary (Yes/No) prediction market**.
- Manages an **AMM** for pricing and holds user collateral.
- Uses **ERC1155 outcome shares**:

  - **Token ID 0 → NO**
  - **Token ID 1 → YES**

- Market resolution is handled by the **admin (owner)**.
- Rewards winning participants and updates their reputation via **ReputationManager**.

### **TrueMarketFactory.sol**

- Deploys and manages all **PredictionMarket** contracts.
- Tracks each deployed market instance.
- Assigns protocol admin as the **resolution authority** for new markets.

---

## 📍 Deployed Addresses (Moca Testnet) - Note: Contract names updated

- **TUSD (Collateral):** `0xE73559ce9FD6dde324210A4D250610F41728029d`
- **ReputationManager:** `0x6e5b1B891510DbA56D79914bC33AA0c5fBE1C839`
- **TrueMarketFactory:** `0xd25929931c0A761D8Ce7cE6fa6b6262223F828ac`

---

## 🆔 Proof-of-Personhood IDs (Moca Testnet)

- **Partner ID:** `8a222988-f7f8-42d3-9b39-543d93d6fb16`
- **Issuer DID:** `did:air:id:test:4P7hewb4uup7yXSjCpMgYKSS4jbxJJcKN5qJFu4KDM`
- **Verifier DID:** `did:key:81euP4PQpXKBieSqhtVqRUUxA1tMhLYhUhdAXLnoMzB2Vzeq8anV7Y1PdQyXm2HyJ29kCNopbPjLpQsmCNMzCgGxmv`
- **Issuer Schema ID:** `c21pp060o90f20065313lz`
- **Verifier Program ID:** `c21pp030oeirj0051859o0`

---

## � Progress

- ✅ Core contracts implemented (ReputationManager, PredictionMarket, TrueMarketFactory).
- 🔄 **UniversalVerifier integration** pending (for proof-of-personhood).
- 🖥 Frontend development in progress (UX reference: **Limitless Exchange**).

---

## 📂 Repository Structure

```
/contracts
  ├── ReputationManager.sol
  ├── PredictionMarket.sol
  └── RealMarketFactory.sol

/scripts
  └── deployment & verification (planned)

/docs
  └── Technical documentation (in progress)

/frontend
  └── Web interface (work in progress)
```

---
