# 🏛️ IncCalc — Cyber Nations Nation Optimizer

> *A calculator suite for the browser-based nation simulation game [Cyber Nations](https://www.cybernations.net), rebuilt from its original ~2007 PHP codebase into a modern Next.js + TypeScript application.*

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [A Brief History of Cyber Nations](#-a-brief-history-of-cyber-nations)
- [Why Calculators Mattered](#-why-calculators-mattered)
- [IncCalc's Origins](#-inccalcs-origins)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)

---

## 🧮 About the Project

IncCalc is an optimization calculator for [Cyber Nations](https://www.cybernations.net), a free, persistent, browser-based nation simulation game that has been running continuously since January 6, 2006. Players manage virtual nations — building infrastructure, training military units, researching technology, trading resources, and engaging in diplomacy and warfare.

Cyber Nations' economic engine is driven by a web of interconnected, non-linear formulas. Infrastructure costs spike at discrete thresholds. Upkeep bills follow a different set of tiers. Income is a chain of multiplied modifiers across happiness, tax rate, improvements, resources, and population. Making optimal decisions about what to buy and when requires crunching real numbers — and that's what IncCalc does.

---

## ✨ Features

### 🏠 Nation Parser
Paste your "View My Nation" text directly from the game and IncCalc extracts 30+ statistics automatically — infrastructure, technology, land, population, military, resources, improvements, and more.

### 💰 Economy Calculator
- **Infrastructure costs** with tier-aware K-value lookup tables
- **Population growth** projections based on infrastructure purchases
- **Daily upkeep bill** calculations with technology and improvement discounts
- **ROI analysis** to find the optimal infrastructure purchase size

### 🔬 Technology Calculator
- Per-level and total cost projections
- University modifier support (up to 10% discount per university)
- Break-even analysis against current tech levels

### ⚔️ Military Calculator
- **War mobilization**: maximum soldiers and tanks purchasable given current citizens
- Soldier and tank cost calculations with resource discounts (iron, oil, lead)
- **Spy operations odds calculator** with interactive charts
- Threat level multipliers from Low (0.75×) to Severe (1.25×)
- Guerrilla camp and barracks exponential modifiers

### 🏗️ Improvements Analyzer
- Revenue impact per improvement type
- ROI ranking to prioritize purchases
- Infrastructure cost-per-unit impact analysis

### 🏰 Wonders Projector
- Revenue analysis for each national wonder
- Days-to-ROI calculations
- Comparative benefit analysis across wonder options

### 🌾 Resource Optimizer
- All 21 base resources (Aluminum, Coal, Gold, Iron, Lead, Lumber, Marble, Oil, Rubber, Uranium, Water, Wheat, Cattle, Fish, Furs, Gems, Pigs, Silver, Spices, Sugar, Wine)
- 10 bonus resource combinations (Asphalt, Automobiles, Beer, Construction, Fine Jewelry, Interstate, Microchips, Radiation Cleanup, Scholar, Steel)
- Premade combos for Money, Infrastructure, and Hybrid strategies
- Resource modifiers feed into all other calculators automatically

---

## 🌍 A Brief History of Cyber Nations

### 🚀 The Beginning (2006)

Cyber Nations was created by solo developer **Kevin Marks** (known in-game as "Admin"), inspired by a childhood board game he'd invented using push pins on a world map to simulate territorial control. He registered the domain in 2003, left it idle for two years, then began coding on Christmas Eve 2005. The game launched publicly on **January 6, 2006**.

Growth was initially slow — word of mouth and forum posts. The decisive influx came when members of the **NationStates** community discovered Cyber Nations and found its real economic and military systems compelling where NationStates offered only issue-based governance. Within 18 months, over **100,000 nations** had been created, with roughly **40,000 active simultaneously** at peak.

### 🏰 The Alliance Era (2006–2007)

What made Cyber Nations special wasn't just its mechanics — it was what players built on top of them. The alliance system was **entirely player-created**. Alliances wrote constitutions, elected governments, conducted trials, maintained banks, and organized military chains of command through external forums and in-game mechanics.

The first alliance was the **Cross Atlantic Treaty Organization (CATO)**, which later expanded into **GATO** (Global Alliance and Treaty Organization). The **New Pacific Order (NPO)** was founded around January 27, 2006, by a group that had migrated from a same-named NationStates organization. The NPO would go on to become the most powerful — and most controversial — force in the game's history.

### ⚔️ The Great Wars (2006–2007)

- **Great War I** (Summer 2006): The NPO and New Polar Order fought against a coalition called the CoaLUEtion (named after GameFAQs' "Life, the Universe, and Everything" board, which contributed a wave of players). Both sides claimed victory.
- **Great War II** (Winter 2007): The Initiative (an NPO-led bloc) vs. The League. The Initiative won decisively.
- **Great War III** (March 2007): The bloodiest conflict in CN history, involving **over 50 alliances and thousands of nations**. Military casualties exceeded the combined total of all prior wars. Server performance buckled under the strain. This war represents the apex of Cyber Nations' cultural moment — maximum tension, maximum engagement.

### ☢️ The Nuclear Age (2009–2012)

- **Karma War** (April–June 2009): A staggering **103-alliance coalition** called Karma united against the NPO and its Hegemony allies. This was the largest war coalition in CN history and definitively ended the NPO's era of dominance.
- **Bipolar War** (January 2010): Another global nuclear conflict that reshaped the political order.
- **Dave War** (June 2012): One of the last major wars of the game's active era, originating from raiding and recruitment disputes.

### 📉 The Long Twilight (2012–Present)

By the early 2010s, the player base had begun to contract. Many veterans migrated to **Politics and War** (launched 2014), a spiritual successor with deeper city-based mechanics. The community that remains in Cyber Nations is small, loyal, and experienced. The game continues to run at [cybernations.net](https://www.cybernations.net) with no server resets since launch — meaning nations founded in 2006 still exist today, two decades later.

---

## 🧠 Why Calculators Mattered

Cyber Nations' formula complexity made optimization a genuine intellectual exercise:

- **Infrastructure costs are tier-gated**, with major cost spikes at thresholds like 20, 100, 1000, 3000, 5000, 8000, and 15,000. The cost of going from point A to point B is *not* simply `(B - A) × unit_cost` — you have to account for each tier boundary crossed.
- **Daily upkeep** follows a similar but distinct set of tiers, reduced by technology (up to 10% discount).
- **Income** chains multiple multipliers: `(base + happiness_bonus + resource_bonuses) × improvement_multipliers × citizens × tax_rate`, where citizen count is itself a function of infrastructure, land, and environment.
- **Tax rate and happiness interact inversely** — lowering your tax rate increases happiness, which increases per-citizen income. A lower tax rate can produce *higher* total revenue depending on the happiness differential. Finding the optimum is the central problem.
- **Tech deal profitability** requires comparing effective costs across 10-day aid windows and purchase increment optimization.

The community produced spreadsheets, web calculators, and exhaustive guides. IncCalc is part of this tradition — originally built as a tool for **Inc. Services**, a consulting organization within the game.

---

## 🕰️ IncCalc's Origins

IncCalc was originally developed around **2007** as a PHP web application during Cyber Nations' peak era. The legacy codebase (preserved in the `legacy/` directory) reveals:

- 🖥️ **PHP 5.2-era** object-oriented architecture with separate calculator classes for infrastructure, population, upkeep, technology, and military
- 📊 **Flash-based charts** (SWF files) for data visualization — a technology of its time
- 🔐 **User authentication system** with admin panels, group management, and session tracking
- 💼 **"Inc. Services"** branding — it was built as part of a player-run consulting operation within the game
- 🗄️ **MySQL database** backend for user accounts and saved nation data

The tool has now been completely rebuilt as a **modern client-side application** using Next.js and TypeScript, preserving all the original game formulas while providing a contemporary user experience. No server or database required — all calculations run in the browser with nation data persisted in localStorage.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚡ Framework | [Next.js](https://nextjs.org/) 16 |
| 📝 Language | TypeScript |
| ⚛️ UI Library | React 19 |
| 🎨 Styling | Tailwind CSS 4 |
| 🧩 Components | [shadcn/ui](https://ui.shadcn.com/) + Base UI |
| 📈 Charts | Recharts |
| 🔣 Icons | Lucide React |
| ☁️ Deployment | Vercel |

### Legacy Stack (preserved in `legacy/`)

| Layer | Technology |
|-------|-----------|
| 🐘 Language | PHP 5.2+ |
| 🎬 Charts | Macromedia/Adobe Flash (SWF) |
| 🗄️ Database | MySQL |
| 🌐 Server | Traditional LAMP stack |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/cheesejaguar/IncCalc.git
cd IncCalc

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
IncCalc/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # 🏠 Home — Nation parser
│   │   ├── economy/            # 💰 Infrastructure, population, upkeep
│   │   ├── tech/               # 🔬 Technology costs
│   │   ├── military/           # ⚔️ Mobilization & spy ops
│   │   ├── improvements/       # 🏗️ Improvement ROI
│   │   ├── wonders/            # 🏰 Wonder projections
│   │   └── resources/          # 🌾 Resource optimizer
│   ├── lib/
│   │   ├── calculators/        # Core calculation engines
│   │   └── data/               # Game data (resources, improvements, wonders)
│   ├── components/             # Shared UI components
│   └── hooks/                  # Custom React hooks (useNationData, etc.)
├── legacy/                     # Original ~2007 PHP codebase
│   ├── infra/                  # Infrastructure calculator classes
│   ├── military/               # Military calculator classes
│   ├── population/             # Population calculator classes
│   ├── tech/                   # Technology calculator classes
│   ├── upkeep/                 # Upkeep calculator classes
│   ├── resource/               # Resource calculator classes
│   ├── admin/                  # User management & admin panel
│   ├── auth/                   # Authentication system
│   └── common/                 # Shared utilities, Flash charts, parsing
├── public/                     # Static assets
└── package.json
```

---

<p align="center">
  Built with ❤️ for the Cyber Nations community — from 2007 to today.
</p>
