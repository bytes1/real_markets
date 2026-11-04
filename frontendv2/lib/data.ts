// lib/data.ts

export interface Market {
  market_id: number;
  market_title: string;
  category: "Crypto" | "Politics" | "Sports" | "Entertainment";
  outcome_a: string;
  outcome_b: string;
  yesPercentage: number;
  noPercentage: number;
  volume: string;
  participants: number;
  deadline: string;
  marketType: string;
  currency: string;
  market_data: string;
  image: string;
  isFlashMarket?: boolean;
  isClosed?: boolean;
  cardStyle?: "image" | "text"; // <-- NEW: To control card style
}

export const data: Market[] = [
  {
    market_id: 4,
    market_title: "Did Moca Chain launch mainnet before May 2026?",
    category: "Crypto",
    outcome_a: "YES",
    outcome_b: "NO",
    yesPercentage: 50,
    noPercentage: 50,
    volume: "0k",
    participants: 0,
    deadline: "May 31",
    marketType: "Binary",
    currency: "MUSD",
    market_data: `Blockchain: Did Moca Chain launch its mainnet before May 2026?;**Market Dates:**\n\n- **Market Period:** From market publication until May 31, 2026, at 11:59 PM UTC.\n- **Market Close**: May 31, 2026, at 11:59 PM UTC.\n- **Resolution Deadline**: Within 48 hours after May 31, 2026, or when the mainnet launch is officially confirmed.\n\n**Resolution Details:**\n\n- The market resolves to **YES** if Moca Chain’s mainnet launch is officially confirmed **on or before May 31, 2026**.\n- The market resolves to **NO** if no such official announcement or on-chain deployment confirmation occurs by that date.\n- Verification will rely on official sources such as [mocanetwork.io](https://mocanetwork.io), their GitHub repository, or official social media posts from verified Moca Network accounts.\n\n**Cancelation Conditions:**\n\nThis market will be canceled if:\n\n- The Moca Chain team publicly announces a cancellation or indefinite delay of the mainnet launch.\n- No verifiable information is available from official sources by the resolution date.\n- Moca Chain undergoes a rebrand or merges into another project, making resolution criteria unclear.\n\nIn the event of cancelation, participants may claim their stakes at the market value of their open positions at the time of cancellation. This could result in a profit or a loss, depending on the price of their outstanding shares.␟"Moca Chain Mainnet Launch","No Launch Before May 2026"␟Blockchain;;[https://mocanetwork.io;Moca Network␟](https://mocanetwork.io;Moca Network␟)`,
    image:
      "https://ipfs.io/ipfs/bafkreiefjall5qifl5ubcflz72xthnuxtvodwibgmgr2w2nyne5w72fkqq",
    cardStyle: "image",
  },
  {
    market_id: 5,
    market_title: "Did True Markets win a share in Wave 3?",
    category: "Crypto",
    outcome_a: "YES",
    outcome_b: "NO",
    yesPercentage: 50,
    noPercentage: 50,
    volume: "0k",
    participants: 0,
    deadline: "Nov 8",
    marketType: "Binary",
    currency: "MUSD",
    market_data: `Hackathon: Did True Markets win a share in Wave 3?;**Market Dates:**\n\n- **Market Period:** From market publication until November 8, 2025, at 11:00 PM UTC.\n- **Market Close**: November 8, 2025, at 11:00 PM UTC, when official results are announced or confirmed.\n- **Resolution Deadline**: November 8, 2025, or earlier if the Wave 3 results are publicly declared.\n\n**Resolution Details:**\n\n- The market resolves to **YES** if True Markets is officially listed as one of the Wave 3 winners or share recipients in the WaveHacks event on the [Akindo platform](https://app.akindo.io/wave-hacks/X4ZJjD3W1haZNPmM?tab=products).\n- The market resolves to **NO** if True Markets is not listed as a winner or if the results do not mention the project receiving any allocation.\n\n**Cancelation Conditions:**\n\nThis market will be canceled if:\n\n- The Wave 3 event is canceled or postponed beyond the Market Period.\n- Official results are not published on the Akindo platform or other verified channels.\n- The project ‘True Markets’ is disqualified, withdrawn, or renamed prior to the resolution period.\n\nIn the event of cancelation, participants may claim their stakes at the market value of their open positions at the time of cancellation. This could result in a profit or a loss, depending on the price of their outstanding shares.␟"True Markets","Wave 3"␟Hackathon;;[https://app.akindo.io/wave-hacks/X4ZJjD3W1haZNPmM?tab=products;Akindo␟](https://app.akindo.io/wave-hacks/X4ZJjD3W1haZNPmM?tab=products;Akindo␟)`,
    image:
      "https://ipfs.io/ipfs/bafkreighdo7ijncarhsz2aqd3udihwzndw2qzerslnkgwstkacxs5vznne",
    cardStyle: "image",
  },
  {
    market_id: 0,
    market_title: "Gold vs ETH - Which hits $5K first?",
    category: "Crypto",
    outcome_a: "Gold",
    outcome_b: "ETH",
    yesPercentage: 50,
    noPercentage: 50,
    volume: "0",
    participants: 2,
    deadline: "Dec 31, 2025",
    marketType: "Binary",
    currency: "MUSD",
    market_data: `Gold vs ETH - Which hits $5K first?;**Market Details:**\n\n- **Market Close:** This market will only be closed once a resolution is achieved.\n- **Resolution Deadline:** The resolution will be determined as soon as an outcome is reached.\n- **Market Target:** $5,000.00.\n\n**Resolution Criteria:**\n\nThe market resolves based on which asset first **reaches or exceeds the Market Target:**\n\n- **“ETH”** if Ethereum (ETH/USDT) price on Binance hits or exceeds the Market Target.\n- **“GOLD”** if Gold (XAU/USD) price on TradingView hits or exceeds the Market Target.\n\n**Resolution Details:**\n\n- ETH price will be tracked using **Binance’s ETH/USDT spot chart:**\n\n<https://www.binance.com/en/trade/ETH_USDT?type=spot>\n\n- GOLD price will be tracked using **TradingView’s XAU/USD chart (OANDA):**\n\n<https://www.tradingview.com/chart/?symbol=OANDA%3AXAUUSD>\n\n- The **1-minute candle close price** (“C”) will be used to confirm when a target is hit.\n\n***Tie-breaker rules:***\n\n- If both assets reach or exceed $5,000 **within the same 1-minute candle**, the first to hit the mark will be determined using finer candle data (e.g., second or tick data) from their respective platforms.\n- Price spikes or brief wick touches that do not close above $5,000 will **not** count as a hit — only a candle **close** value is valid.\n\n**Cancellation and Invalidity Conditions:**\n\n- Either Binance or TradingView becomes unavailable, unreliable, or experiences major disruptions.\n- Price data for either ETH or GOLD cannot be verified during the market period.\n- Any significant technical issue prevents proper tracking or confirmation of the target hit.\n\n*In case of cancellation, participants may claim their stakes at the current market value of their open positions at the time of cancellation. This could result in a profit or a loss depending on the price of their outstanding shares.*␟"Gold","ETH"␟Crypto,Economy;;https://www.binance.com/en/trade/ETH_USDT?type=spot;Binance / TradingView␟`,
    image:
      "https://ipfs.io/ipfs/QmQfWHShio7K1Ev6BtTEA4CBC55VJRAPmXRkS6wwzhhiSb",
    cardStyle: "image", // <-- NEW: Standard image card
  }, // SBET PRICE: Pump to $22 or Dump to $12?
  {
    market_id: 1,
    market_title: "Stablecoin market cap to pass $360B before February?",
    category: "Crypto",
    outcome_a: "YES",
    outcome_b: "NO",
    yesPercentage: 50,
    noPercentage: 50,
    volume: "0K",
    participants: 0,
    deadline: "HIT",
    marketType: "Binary",
    currency: "MUSD",
    market_data: `Stablecoin market cap to pass $360B before February?;**Market Dates:**\n\n- **Observation Period:** From publication date until January 31, 2025, at 11:59 PM UTC.\n- **Market Close:** January 29, 2025, at 11:59 PM UTC, two days before resolution.\n- **Resolution Time:** January 31, 2025, at 11:59 PM UTC.\n- **Market Target:** $360,000b\n\n**Yes/No Criteria:**\n\n- Resolves to “**Yes**” if the “Total Stablecoins Market Cap”, as shown by DeFiLlama, is strictly above the Market Target for any day of the Observation Period.\n- Resolves to “**No**” if not.\n\n**Resolution:**\n\n- The outcome will be determined using DeFiLlama’s “Total Stablecoins Market Cap” chart.\n\n**Cancelation Conditions:**\n\nThe market will be canceled if:\n\n- DeFiLlama or the “Total Stablecoins Market Cap” chart becomes unavailable for prolonged periods, becomes unreliable, or experiences significant disruptions during the Observation Period\n- Any technical issues prevent reliable market cap verification for resolution\n\nIn the event of cancelation, participants may claim their stakes at the market value of their open positions at the time of cancelation. This could result in a profit or a loss, depending on the price of their outstanding shares.␟"Yes","No"␟Crypto;;https://defillama.com/stablecoins;Defilama␟`,
    image:
      "https://ipfs.io/ipfs/QmZ5WGnYicrGABb5H3wKbuDA85rZx2KZ1sBNcjuVn9YkL1",
    isFlashMarket: true,
    cardStyle: "image", // <-- NEW: Standard image card
  }, // Will Donald Trump visit China in 2025?
  {
    market_id: 2,
    market_title: "Will this be the longest government shutdown in US history?",
    category: "Politics",
    outcome_a: "YES",
    outcome_b: "NO",
    yesPercentage: 50,
    noPercentage: 50,
    volume: "0k",
    participants: 0,
    deadline: "Jan 1",
    marketType: "Binary",
    currency: "MUSD",
    market_data: `Will this be the longest government shutdown in US history?;**Market Dates:**\n\n- **Market Period:** From market publication until December 5, 2025, at 12:02 AM ET.\n- **Market Closes:** December 5, 2025, at 12:02 AM ET.\n- **Resolution Time:** December 5, 2025, at 12:02 AM ET.\n\n---\n\n**Resolution Criteria:**\n\n- The market resolves to “Yes” if the shutdown is still ongoing as of December 5, 2025, at 12:02 AM ET.\n- The market resolves to “No” if the U.S. Office of Personnel Management (OPM) announces that the U.S. federal government is no longer shut down during the Market Period.\n- Any partial closure (where only some government agencies are closed) will count as a continued shutdown.\n- Closures for holidays, weather, or non-appropriation reasons do not count as shutdowns.\n\n---\n\n**Resolution Details:**\n\nThe official determination will be based on the **U.S. Office of Personnel Management (OPM) Operating Status** updates, which provide the government’s operating status during lapses in appropriations.\n\nIf OPM’s status announcements are unavailable or significantly altered, reliable mainstream news outlets (e.g., Reuters, AP, or major U.S. networks) may be used to confirm the timing of the government reopening or confirmation that the shutdown is ongoing.\n\n---\n\n**Cancellation (Invalidity) Conditions:**\n\nThis market will be **canceled** if:\n\n- OPM’s official source becomes unavailable, unreliable, or experiences major changes preventing verification.\n- The U.S. Government shutdown event cannot be verified or clearly defined.\n- Any major external factor prevents fair or consistent resolution.\n\nIf canceled, participants may claim their stakes at the then-current market value of their shares, which could result in a profit or a loss depending on their open positions.␟"Yes","No"␟Politics;;https://www.opm.gov/policy-data-oversight/snow-dismissal-procedures/current-status/;OPM␟`,
    image:
      "https://ipfs.io/ipfs/QmUGtJzRvJ7jr3okyfqUF6CtuTqxVxgVZhyLQpHnrBTiyc",
    isFlashMarket: true,
    cardStyle: "image", // <-- NEW: Standard image card
  },
  {
    market_id: 3,
    market_title: "Edwards vs. Muhammad: Who wins?",
    category: "Sports",
    outcome_a: "YES",
    outcome_b: "NO",
    yesPercentage: 50,
    noPercentage: 50,
    volume: "0k",
    participants: 0,
    deadline: "Nov 22",
    marketType: "Binary",
    currency: "MUSD",
    market_data: `UFC: Edwards vs. Muhammad: Who wins?;**Market Dates:**\n\n- **Market Period:** From market publication until November 22, 2025, at 03:00 AM UTC.\n- **Market Close**: November 22, 2025, at 03:00 AM UTC. twelve hours after the fight is scheduled to start.\n- **Resolution Deadline**: November 22, 2025 at 03:00 AM UTC, or before when the outcome is officially determined.\n\n**Resolution Details:**\n\n- The market resolves to the fight winner — Leon Edwards or Belal Muhammad — as officially declared by the UFC on its website.\n- Any method of victory (KO, TKO, submission, or decision) will be taken into consideration.\n\n**Cancelation Conditions**\n\nThis market will be canceled if:\n\n- The fight does not take place as scheduled.\n- The fight ends in a No Contest.\n- The fight ends in a Draw (including Split Draw, Unanimous Draw, or Majority Draw).\n- The fight is rescheduled outside the Market Period.\n- Official results are not available from [UFC.com](http://UFC.com).\n- If either fighter drops out for any reason.\n\nIn the event of cancelation, participants may claim their stakes at the market value of their open positions at the time of cancellation. This could result in a profit or a loss, depending on the price of their outstanding shares.␟"Edwards","Muhammad"␟Sports;;[https://www.ufc.com/event/ufc-304;UFC␟](https://www.ufc.com/event/ufc-304;UFC␟)`,
    image:
      "https://ipfs.io/ipfs/bafybeigk42q2rdlfnmwb4fymvkhlof752fodit37sdws63sv7tgmavoubq",
    cardStyle: "image", // <-- NEW: Standard image card
  },

  {
    market_id: 6,
    market_title:
      "Oscars 2026: Can “One Battle After Another” score 9+ nominations?",
    category: "Entertainment",
    outcome_a: "YES",
    outcome_b: "NO",
    yesPercentage: 50,
    noPercentage: 50,
    volume: "0k",
    participants: 0,
    deadline: "Jan 22",
    marketType: "Binary",
    currency: "MUSD",
    market_data: `Oscars 2026: Can “One Battle After Another” score 9+ nominations?;**Market Dates:**\n\n- **Market Period:** From publication until the official nominations announcement.\n- **Market Close:** January 22, 2026, at 8:00 AM ET — before the live reveal begins. The closing time may be adjusted once the official schedule is announced.\n- **Resolution Time:** Determined after AMPAS releases the official list of nominees.\n\n**Resolution Criteria:**\n\n- Resolves to **YES** if “One Battle After Another” receives **9 or more official nominations** for the 98th Academy Awards.\n- Resolves to **NO** if it receives **8 or fewer nominations**.\n- Only nominations **officially published by the Academy of Motion Picture Arts and Sciences (AMPAS)** will count toward the total.\n\n**Resolution Details:**\n\n- The outcome will be based on the **official AMPAS nominations list**, confirmed via the Oscars’ official website or live broadcast.\n- If the official data becomes unavailable or significantly delayed, results may be verified through credible industry publications such as **Variety**, **Deadline**, or **The Hollywood Reporter**.\n\n**Cancellation Conditions:**\n\nThis market will be canceled if:\n\n- The 98th Academy Awards nominations are not released or the event is canceled.\n- AMPAS fails to publish an official or verifiable nominations list.\n- Major changes occur to the Oscars’ format or category structure that prevent a consistent count of nominations.\n\nIf canceled, participants may claim their stakes at the market value of their open positions at the time of cancellation. This could result in a profit or loss depending on the price of their outstanding shares.␟"One Battle After Another","Oscars 2026"␟Entertainment;;[https://www.oscars.org;AMPAS␟](https://www.oscars.org;AMPAS␟)`,
    image:
      "https://ipfs.io/ipfs/bafkreicc6qw6l4d5zpqzsgxsqzb7flrx4u7f6bmmr4tw6ryrkc2tirqsge",
    cardStyle: "image",
  },
];
