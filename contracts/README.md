# RealMarket Protocol – Smart Contracts

This repository contains the **core smart contracts** for the RealMarket Protocol, a **reputation-based prediction market**.

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

### **RealMarketFactory.sol**

- Deploys and manages all **PredictionMarket** contracts.
- Tracks each deployed market instance.
- Assigns protocol admin as the **resolution authority** for new markets.

---

## 🚧 Progress

- ✅ Core contracts implemented (ReputationManager, PredictionMarket, RealMarketFactory).
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
