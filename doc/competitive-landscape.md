# Cyber Nations Competitive Tool Landscape Research Report

**Prepared for:** IncCalc Development Team
**Date:** April 2026
**Scope:** Comprehensive audit of existing Cyber Nations calculator tools, nation managers, and optimization utilities

---

## Executive Summary

The Cyber Nations tool ecosystem is a collection of community-built utilities developed between roughly 2007 and 2016, with almost no new standalone calculator tools emerging since then. The dominant surviving tool is **Carnivore (lyricalz.com)**, which is less a calculator and more a data tracker — it scrapes and stores historical nation and alliance statistics but offers only a handful of calculators. The two primary historical calculator suites, the **C2Talon Calculator** (PHP, 2007-2014) and the **MrFixitOnline/Intelisol CNCalc Portable Suite** (standalone HTML, circa 2009-2012), are both abandoned and partially broken. The **Inc. Cybernations Calculator** (the project this codebase shares a name with) was a separate older PHP/SQL web app last updated in 2013.

The practical implication for IncCalc is significant: **IncCalc is currently the most feature-complete, actively maintained CN calculator that exists.** No competitor offers a unified tool with nation parsing, advisory outputs, spy odds visualization, improvement ROI, wonder income comparison, and military equipment calculations in a single modern web app. The largest identifiable feature gaps are: a **warchest/days-of-bills calculator**, a **land purchase cost calculator**, a **trade circle resource optimizer**, a **nation strength (NS) projector**, and a **historical nation tracking** capability. The community remains active on the official forums and per-alliance Discord servers, with no consolidated Discord that would function as a natural distribution channel.

The design aesthetic of every competing tool ranges from mid-2000s HTML tables to basic Bootstrap forms. IncCalc's Next.js + shadcn/ui stack already represents a generational UX leap. The opportunity is to double down on depth and polish while closing a small number of high-value calculator gaps.

---

## Technical Overview

### The Cyber Nations Game Loop (Context for Tools)

Cyber Nations is a persistent browser-based nation simulator (launched 2006) where players log in once daily to collect income, pay bills, buy infrastructure/technology/military, and conduct wars. The game's depth comes from interconnected formulas that determine:

- **Income**: Population x per-citizen income (driven by happiness, tax rate, resources, improvements, wonders)
- **Bills**: Infrastructure upkeep + military unit upkeep + improvement upkeep, paid daily
- **Nation Strength (NS)**: Composite score used to determine valid war targets (75-133% range)
- **Combat**: Soldier/tank/aircraft/navy battles with probabilistic outcomes based on unit counts, technology, and DEFCON
- **Growth strategy**: Infrastructure jumps (buy 200+ infra at once to avoid income loss), tech deals, trade circles

This creates demand for calculators that answer: "What does X purchase cost me today, and what does it pay me back over time?"

### Technology Stack of Existing Tools

| Tool | Stack | Status |
|---|---|---|
| C2Talon cncalc | PHP (server-rendered) | Dead (2014) |
| Inc. CN Calculator (old) | PHP + SQL + JavaScript | Dead (2013) |
| Intelisol CNCalc Suite | Standalone HTML + JavaScript | Partially live |
| Carnivore (Lyricalz) | Unknown (likely PHP/Python) | Active |
| CNExtend (Firefox) | JavaScript browser extension | Unmaintained |
| CNExtend Chrome | JavaScript browser extension | Unmaintained |
| Eye in the Sky | JavaScript browser extension | Unmaintained |
| CN Utilities | Next.js (React) | Active (limited scope) |
| IncCalc | Next.js + TypeScript + shadcn/ui | Active |

---

## Inventory of Existing Tools

### 1. Carnivore (cybernations.lyricalz.com) — ACTIVE

**Status:** Actively maintained. The developer accepts donations and commissions custom tools for subscribers paying £5+/month.

**Primary purpose:** Historical data tracker, not a planning calculator. The site scrapes game data twice daily and has records dating back to 2011. ~1,500 unique visitors/month, ~100,000 hits/month.

**Data tracking features:**
- Per-nation history (alliance, government, tech, infra, land, NS, DEFCON, military, casualties, resources) — snapshotted every 12 hours
- Aid history for all nations (49,081+ pages of records, 2,454,011 aid slots tracked)
- War history and war slot data (189,302 war slots)
- Alliance statistics (618,209 records)
- Alliance aid tracking
- Alliance war data and damage comparison
- Nation strength graphs (implied by alliance chart feature)

**Calculator tools offered:**
- Infrastructure purchase calculator (with resource/improvement/wonder/government modifiers)
- Population and environment calculator
- Deployment calculator
- Dynamic nation signature generator (image URL with selectable alliance flag background)
- "Economic general calculator" (limited details available)

**Notably missing from Carnivore calculators:**
- Technology cost calculator
- Military equipment costs (aircraft, nukes, cruise missiles)
- Spy odds
- Improvement ROI advisor
- Wonder income advisor
- Happiness breakdown
- Crime index
- Navy costs
- Warchest calculator
- Nation strength projector

**URL:** https://cybernations.lyricalz.com/

---

### 2. Intelisol CNCalc Portable Suite — PARTIALLY LIVE

**Status:** Hosted as standalone HTML files. Still accessible. No active maintenance — original "MrFixitOnline.com" branding has been modified/mirrored at intelisol.org.

**Design:** Single-page HTML forms with JavaScript computation. No server dependency. Plain HTML, no framework.

**Tools in the suite:**

**Infrastructure Calculator** (CN_SE_Infra_Calc_100.htm):
- Inputs: Current infra level, number of levels to buy, resources (Aluminum, Coal, Iron, Lumber, Marble, Rubber, Basalt), factory count (0-5), government type, Scientific Development Center, Inter-State System, planetary base (none/Mars/Moon)
- Outputs: Cost per level, total cost, broken into 100-level increments
- Unique: Applies cumulative factory discount (up to 40%), government type modifier, warning about Rubber not being included in live game calculations despite showing it

**Infrastructure Upkeep Calculator** (same page):
- Inputs: Infra level, tech level, nation strength, resources, labor camps, national wonders
- Formula: Progressive brackets + tech modifier formula `(2 x tech) / strength` (capped at 10% min reduction)

**Technology Calculator** (CN_SE_Tech_Calc.htm):
- Inputs: Current tech level, resources (Gold, Microchips), university count, National Research Lab
- Modes: Input money available OR desired tech level
- Outputs: Step-by-step cost breakdown in 10-level increments
- Discounts: Gold -5%, Microchips -8%, National Research Lab -3%, each University -10%

**Land Calculator** (CN_SE_Land_Calc_100.htm):
- Inputs: Current land level, resource checkboxes (Cattle -10%, Fish -5%, Rubber -10%)
- Special: Peak land rebuy discount (50% reduction for land below prior peak)
- Outputs: Cost per 100-level batch, total cost

**URL:** http://www.intelisol.org/CNCalc/

---

### 3. C2Talon Calculator (GitHub archive) — DEAD

**Status:** GitHub repository preserved but the live site (c2t.org/cn/calc/) is gone. Last updated June 2014. A Wayback Machine snapshot exists from May 2015.

**Core concept:** "Relative and comparative calculator" — shows a side-by-side before/after view of your nation so you can model proposed changes.

**Features:**
- Nation import via copy/paste from game page source
- Events system: add arbitrary modifiers (trade bonuses, temporary events)
- Tracks: Infrastructure, technology, military (aircraft), resources (food, oil, uranium, iron, bauxite, lead, gasoline, munitions), population, land, happiness, environment, nuclear capabilities, Mars/Moon colony, tax rate, citizen income
- Side-by-side comparison mode

**Known limitations acknowledged by author:**
- No navy calculations
- Literacy formula unknown
- Happiness equation partially unknown (up to 1% skew)
- No infra calculations above 15,000
- No planetary base calculations above a certain threshold

**Stack:** 100% PHP. Server-side rendering architecture from circa 2007-2014.

**GitHub:** https://github.com/C2Talon/cncalc

---

### 4. Inc. Cybernations Calculator (SourceForge) — DEAD

**Status:** Last updated March 2013. SourceForge project still has download page. OpenHub listing was deleted. This is a different project from the IncCalc in this repository, despite sharing similar naming.

**Features (from screenshots and descriptions):**
- Nation data parser (automatic)
- Nation growth graph visualization
- Improvement calculator
- Infrastructure calculator
- Login/account system

**Stack:** JavaScript + PHP + SQL, GPL v2 license.

**What distinguished it:** Integrated account system for saving data and tracking growth over time (rare for the era).

**URL:** https://sourceforge.net/projects/inc-cn-calc/

---

### 5. CNExtend Firefox/Chrome Extensions (OpenCN) — UNMAINTAINED

**Status:** GitHub repositories exist under the OpenCN organization but have not been updated in years. Only 1-2 GitHub stars each.

**What CNExtend does:**
- Modifies the in-game nation screen layout via drag-and-drop XML-based profiles
- **Hover-over financial impact calculator**: When hovering over an improvement or wonder in-game, displays the net income change from buying or selling it — calculated from your most recently viewed nation data
- Layout editor accessible via right-click menu
- Profile switching without page reload

**Eye in the Sky (eits):** A separate Firefox extension that "sends page source to a URL" — likely used by alliance leadership for automated member monitoring.

**GitHub:** https://github.com/OpenCN

---

### 6. CN Utilities (cn-utilities.com) — ACTIVE (limited scope)

**Status:** Active. Built with Next.js (React). Appears to be a recently built tool.

**Features:**
- **Treaty Web** (treatyweb.cn-utilities.com): Interactive network graph visualization of diplomatic relationships between alliances. Features include drag and drop, zoom, straight-line display, "mutuals only" filter, "all blocs" view, and multiple themes. Was updated as recently as July 2025.
- Historically included a trade circle calculator (now unclear if still live)

**Notable:** This is the only other modern Next.js-based CN tool identified, but it focuses on diplomacy visualization rather than nation economics.

**URL:** https://cn-utilities.com/

---

### 7. Heisanevilgenius Battle Odds Calculator — STATUS UNKNOWN

**Status:** URL (heisanevilgenius.com/cybernations/battle.php) still resolves but the site may be stale.

**Features:**
- Inputs: Effective soldiers, tanks, technology level for both attacker and defender
- Additional inputs: Defender infrastructure, defender land control, attacker DEFCON, defender DEFCON, time of day (day/night)
- Output: Single probability percentage ("Odds of success")
- Specifically models night assault conditions

**Compared to IncCalc spy odds:** This is a ground battle calculator, not a spy operation calculator. Different use case. IncCalc does not have a ground battle odds calculator.

**URL:** https://www.heisanevilgenius.com/cybernations/battle.php

---

### 8. Metalbot Cybernations File Parser (GitHub) — NICHE TOOL

**Status:** GitHub repository, not a web tool. A C# library for parsing CN statistics file exports.

**What it does:** Parses CN data dump CSV files for programmatic analysis. Intended for developers building alliance management or analytics systems, not for end-user calculation.

**GitHub:** https://github.com/metalbot/cybernations_file_parser

---

### 9. Flash-Based Resource Calculator — DEAD

A Flash-based resource/trade circle calculator was referenced in a January 2023 forum post as broken due to Flash EOL. No recovery is possible.

---

### 10. Trade Circle Calculator (cn-utilities.com/tradecirkelcalculator.aspx) — DEAD

Historically hosted at cn-utilities.com. Visualized trade circle statistics: resource combinations, bonus resources unlocked, happiness increases, population bonuses, infra cost discounts. This domain now hosts the Treaty Web tool, and the trade circle calculator URL no longer resolves.

---

## Feature Gap Analysis

The table below maps features across tools and identifies what IncCalc does and does not have.

| Feature | IncCalc | Carnivore | Intelisol | C2Talon | Battle Calc |
|---|---|---|---|---|---|
| Nation data parser | Yes | No | No | Yes | No |
| Infra purchase cost | Yes | Yes | Yes | Yes | No |
| Infra upkeep calculator | Yes | No | Yes | Partial | No |
| Tech cost calculator | Yes | No | Yes | Yes | No |
| Population calculator | Yes | Yes | No | Yes | No |
| Happiness breakdown | Yes | No | No | Partial | No |
| Crime index | Yes | No | No | No | No |
| Military mobilization (soldiers/tanks) | Yes | No | No | No | No |
| Spy odds (with chart) | Yes | No | No | No | No |
| Ground battle odds | No | No | No | No | Yes |
| Improvement ROI advisor | Yes | No | No | No | No |
| Wonder income advisor | Yes | No | No | Partial | No |
| Resource comparison tool | Yes | No | No | No | No |
| Navy vessel costs | Yes | No | No | No | No |
| Aircraft/cruise missile/nuke costs | Yes | No | No | Partial | No |
| Warchest / days-of-bills calculator | **No** | No | No | No | No |
| Land purchase cost calculator | **No** | No | Yes | No | No |
| Nation strength (NS) projector | **No** | No | No | Partial | No |
| Hover improvement/wonder delta | No | No | No | No | No (CNExtend only) |
| Side-by-side before/after comparison | **No** | No | No | Yes | No |
| Historical nation data tracking | No | Yes | No | No | No |
| Alliance aid/war history | No | Yes | No | No | No |
| Nation growth graphs | No | Yes | No | Partial | No |
| Dynamic signature generator | No | Yes | No | No | No |
| Trade circle optimizer | **No** | No | No (dead) | No | No |
| Treaty relationship visualizer | No | No | No | No | No |
| In-browser improvement hover delta | No | No | No | No | No |

**Key gaps where IncCalc has no competitor either (opportunity to be first):**
- Trade circle resource optimizer (Flash tool is dead, cn-utilities version is dead)
- Warchest / days-of-bills calculator (no live tool exists anywhere)
- Nation strength projector (C2Talon had partial, now dead)

**Key gaps where a competitor has a live tool IncCalc doesn't:**
- Land purchase cost calculator (Intelisol is live)
- Ground battle odds calculator (heisanevilgenius is likely live)
- Side-by-side before/after comparison mode (C2Talon concept, now dead)

---

## Comparative Analysis

### Carnivore vs. IncCalc

Carnivore and IncCalc serve fundamentally different use cases. Carnivore is a **retrospective intelligence tool** — it tells you what your nation and others have done historically. IncCalc is a **prospective planning tool** — it tells you what actions to take next and what they will cost. They do not directly compete; a CN player could use both. Carnivore's data tracking capability (twice-daily snapshots since 2011) is a years-long data moat that IncCalc cannot replicate. IncCalc's advisory and calculation depth is something Carnivore has not attempted to build.

### Intelisol Suite vs. IncCalc

Intelisol calculators are narrow, isolated tools in raw HTML. Each is a single page with one job. They have no nation parsing, no advisory layer, and no cross-calculator state. Their value is that they are fast and self-contained. Their weakness is fragmentation: a player calculating an infra jump must manually transfer values between the infra cost, infra upkeep, and tech calculator pages. IncCalc's state sharing via the nation parser is a significant UX advantage.

### C2Talon vs. IncCalc

The C2Talon calculator's most distinctive design concept was the **side-by-side before/after comparison view**, which let players evaluate "what if I buy 500 infra, add 2 improvements, and switch trade circles?" as a unified scenario. IncCalc currently evaluates each category in isolation; adding a scenario comparison layer would meaningfully differentiate it. The C2Talon tool also had a known-limitation problem: the author publicly documented what it could not calculate (navy, literacy, full happiness). IncCalc should maintain similar transparency about formula assumptions.

---

## Practical Recommendations

### Priority 1: Warchest / Days-of-Bills Calculator

No live tool exists anywhere in the ecosystem. High player demand (multiple forum threads exist asking for one). Formula is straightforward: `daily_net_income = gross_income - daily_bills`. A warchest calculator would let players input their current savings, income, and bill totals and output how many days of bills they can sustain. A war scenario mode — modeling increased upkeep from buying military pre-war — would make this genuinely unique.

**Required inputs:** Current savings, daily gross income, current bills, proposed military changes
**Output:** Days of bills sustainable, break-even date for an infra purchase, target savings for a declared war

### Priority 2: Land Purchase Cost Calculator

The Intelisol tool is live but isolated. IncCalc's nation parser already captures land data. Adding a land calculator would let the parser auto-populate inputs and give a unified growth planning experience (infra + tech + land in one session). The Intelisol tool confirmed the formula: tiered pricing brackets, with Cattle/Fish/Rubber resource discounts and a peak-land rebuy 50% discount.

### Priority 3: Ground Battle Odds Calculator

The heisanevilgenius calculator provides this, but its status is uncertain and the UI is minimal. IncCalc's existing spy odds calculator demonstrates the pattern (probabilistic output with a chart). A ground battle calculator taking attacker/defender soldiers, tanks, tech, infrastructure, land, DEFCON, and time of day would round out the military section comprehensively.

### Priority 4: Side-by-Side Scenario Comparison

The C2Talon tool's core UX concept. Allow players to define a "proposed state" (add X infra, Y tech, Z improvements) and see before/after income, bills, population, and NS side by side. This is IncCalc's single biggest structural gap relative to the most sophisticated historical tool.

### Priority 5: Nation Strength Projector

NS is used to determine valid war targets. Players frequently want to know: "If I buy 500 infra, will I break out of range of my current enemies?" Formula is documented (land x1.5 + tanks_deployed x0.15 + tanks_defending x0.20 + cruise_missiles x10 + nukes^2 x10 + tech x5 + infra x3 + soldiers x0.02). A projector that auto-populates from the nation parser and lets players adjust values would be high-value.

### Priority 6: Trade Circle Resource Optimizer

The only live trade circle tool (cn-utilities.com's old version) appears dead. The CN community has no working visual trade circle calculator since Flash died. This is the highest-effort gap but also the one with no competition. It requires: resource combination enumeration (choose 2 resources x 6 players = 12 resources), bonus resource calculation, and a happiness/infra-cost/population benefit summary. A visual circle layout matching the in-game presentation would be distinctive.

### Risk Factors

- **Formula staleness:** Game formulas have changed since 2014. Any calculator that faithfully reproduces 2014 formulas may be silently wrong. Validate against live game outputs before releasing any new calculator.
- **Flash tool nostalgia bias:** Some veteran players still reference broken Flash tools and may not discover IncCalc. Distribution through alliance Discord servers is the primary discovery mechanism.
- **Low player count:** Cyber Nations is a legacy game. Active player count appears to be in the low thousands at most. This bounds the potential user base; tools should be built for depth and quality for existing players rather than growth.

### Resource Requirements

- **Warchest calculator:** 1-2 days, no new data dependencies
- **Land calculator:** 1 day, formula well-documented
- **Ground battle calculator:** 2-3 days, formula research required
- **Scenario comparison UI:** 3-5 days, significant state management work
- **NS projector:** 1 day, formula is fully documented
- **Trade circle optimizer:** 5-10 days, combination logic + UI complexity

---

## Technical Deep Dive

### Nation Strength Formula (documented)

```
NS = (land_purchased × 1.5)
   + (tanks_deployed × 0.15)
   + (tanks_defending × 0.20)
   + (cruise_missiles × 10)
   + ((nukes_purchased² ) × 10)
   + (technology_purchased × 5)
   + (infrastructure_purchased × 3)
   + (soldiers × 0.02)
```

Note: Some players have reported discrepancies; exact formula may have been adjusted. Validate against live game output.

### Infrastructure Cost Formula (documented by Intelisol, confirmed by Carnivore)

Tiered pricing: costs increase at breakpoints (1000, 3000, 4000, 5000, 6000, 8000, 15000 infra). Discounts applied multiplicatively: Lumber -6%, Marble -10%, factory stacks up to 40%, government type modifier, Scientific Development Center -5%, Inter-State System modifier, Mars/Moon base modifiers.

### Tech Cost Formula (documented)

Below level 5: base cost $10,000 per level. Above 5: `(level - 5) × 100 + base`. Discounts: Gold -5%, Microchips -8%, National Research Lab -3%, each University -10%.

### Land Cost Formula (from Intelisol land calc)

Tiered pricing from $400/level (below 20 land) scaling to significantly higher costs above 8,000 land. Resource discounts: Cattle -10%, Fish -5%, Rubber -10%. Peak land rebuy: 50% discount on land purchased below previously owned peak.

### Infra Upkeep Formula (from Intelisol)

Progressive bracket-based upkeep per level. Tech modifier: `(2 × tech) / strength` reduces upkeep, capped at 10% minimum reduction. Resource and wonder discounts applied multiplicatively.

### Income Formula

```
individual_income = ($30 + ($2 × happiness) + improvement_bonuses) × multipliers
daily_income = population × individual_income × tax_rate
```

Happiness drivers: resources, improvements, wonders, government type, team color, trade partner team alignment (+1 per same-team trade partner).

### Ground Battle Odds (from heisanevilgenius calculator)

Inputs: effective soldiers (attacker/defender), tanks (attacker/defender), technology (attacker/defender), defender infrastructure, defender land control, DEFCON levels, time of day. Output is a probability percentage. Night assault applies a modifier. The exact formula is not publicly documented; the CN wiki's military guide describes it qualitatively.

### Spy Operation Odds (already in IncCalc)

IncCalc already implements this with a chart visualization. The community had no graphical tool for this before.

---

## Community Resources

### Official Forums
**forums.cybernations.net** — Primary community hub. Active in 2025-2026 based on alliance recruitment threads. The forum is 403-protected against scrapers (all direct fetch attempts blocked).

### IRC
**#cybernations on irc.coldfront.net** — Referenced in official FAQ. Likely has low traffic in 2026.

### Per-Alliance Discord Servers
The CN wiki maintains an Alliance Discord Directory page (cybernations.fandom.com/wiki/Alliance_Discord_Directory). Discord has largely replaced IRC for alliance coordination. There is no single community-wide CN Discord; each alliance operates its own server. Carnivore also has a support Discord.

### CN Wiki (Fandom)
**cybernations.fandom.com** — The primary reference for game mechanics. Calculator page (cybernations.fandom.com/wiki/Calculators) links to Carnivore's pop calc, Intelisol's infra and tech calcs, and the heisanevilgenius battle calculator. Getting IncCalc listed here would be the highest-value distribution action available.

### Reddit
No r/cybernations subreddit was found in search results. Not a significant community channel.

---

## References

### Tools and Projects (Live or Archived)

- [Carnivore - Cybernations data parser tools](https://cybernations.lyricalz.com/) — Primary active tool suite; data tracker + limited calculators
- [Carnivore Infrastructure Calculator](https://cybernations.lyricalz.com/tools/infracalc) — Live infra purchase calc with modifiers
- [Carnivore Aid History](https://cybernations.lyricalz.com/aid_list) — 49,000+ pages of aid transfer records
- [Intelisol CNCalc - Infrastructure Calculator](http://www.intelisol.org/CNCalc/CN_SE_Infra_Calc_100.htm) — Standalone HTML; purchase + upkeep
- [Intelisol CNCalc - Tech Calculator](http://intelisol.org/CNCalc/CN_SE_Tech_Calc.htm) — Standalone HTML; tiered cost with discounts
- [Intelisol CNCalc - Land Calculator](http://www.intelisol.org/CNCalc/CN_SE_Land_Calc_100.htm) — Standalone HTML; tiered cost with peak rebuy discount
- [C2Talon cncalc GitHub](https://github.com/C2Talon/cncalc) — Archived PHP calculator; before/after comparison concept
- [OpenCN GitHub Organization](https://github.com/OpenCN) — CNExtend browser extensions (Firefox + Chrome)
- [CNExtend Firefox Extension](https://github.com/OpenCN/cnx) — Layout customization + hover improvement delta
- [CNExtend Chrome Extension](https://github.com/OpenCN/cnx-chrome) — Chrome port of CNExtend
- [Inc. Cybernations Calculator - SourceForge](https://sourceforge.net/projects/inc-cn-calc/) — Dead PHP/SQL calculator (2013)
- [Heisanevilgenius Battle Calculator](https://www.heisanevilgenius.com/cybernations/battle.php) — Ground battle probability calculator
- [CN Utilities](https://cn-utilities.com/) — Active Next.js site; treaty visualization
- [Cybernations File Parser - GitHub](https://github.com/metalbot/cybernations_file_parser) — C# library for parsing game data exports

### Community and Documentation

- [CN Wiki - Calculators Page](https://cybernations.fandom.com/wiki/Calculators) — Canonical list of community tools; target for IncCalc listing
- [CN Wiki - Category: Tools](https://cybernations.fandom.com/wiki/Category:Tools) — Broader tools category
- [CN Wiki - Alliance Discord Directory](https://cybernations.fandom.com/wiki/Alliance_Discord_Directory) — Per-alliance Discord servers
- [CN Forums](https://forums.cybernations.net) — Primary community; 403-protected
- [CN Forums - Download link of tools thread](https://forums.cybernations.net/topic/34730-download-link-of-tools-calculators-for-cn-game/) — Historical tool aggregation thread
- [CN Forums - Warchest Calculator request](https://forums.cybernations.net/topic/97526-warchest-calculator/) — Evidence of unmet player demand
- [CN Forums - Infra Calculator thread](https://forums.cybernations.net/topic/97198-infra-calculator/) — Community discussion
- [CN Forums - Tech Calculator thread](https://forums.cybernations.net/topic/108346-tech-calculator/) — Community discussion
- [CN Forums - Non Grata 2025 recruitment](https://forums.cybernations.net/topic/137640-join-non-grata-2025) — Evidence of ongoing game activity
- [CN Wiki - Nation Strength](https://cybernations.fandom.com/wiki/Nation_strength) — NS formula documentation
- [CN Wiki - Infrastructure Jump](https://cybernations.fandom.com/wiki/Infrastructure_jump) — Jump strategy mechanics
- [CN Wiki - BASICS: Economics Guide](https://cybernations.fandom.com/wiki/BASICS:_Economics_Guide) — Comprehensive income/bill mechanics
- [CN Wiki - Technology](https://cybernations.fandom.com/wiki/Technology) — Tech formula documentation
- [CN Forums - Tech Cost Formula thread](https://forums.cybernations.net/topic/87139-tech-cost-formula/) — Community-reverse-engineered formula
