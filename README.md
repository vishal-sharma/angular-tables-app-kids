# 🌟 Math Tables — Kids Multiplication Practice App

An Angular 19 SPA that helps kids (ages 5–12) practise multiplication tables 2×2 through 10×10.  
Live URL: **https://lemon-stone-0b2031000.7.azurestaticapps.net/**

---

## Features

| Feature | Detail |
|---|---|
| **10-question rounds** | Each round draws 10 unique random questions from the full 2–10 × 2–10 range |
| **Typed answers** | Numeric keyboard on mobile; Enter key submits on desktop |
| **Live progress bar** | Gradient bar and "Q x of 10" counter update after every answer |
| **Sound feedback** | Web Audio API (no audio files) — ascending chime for correct, buzz for wrong |
| **3-stage hint system** | See below |
| **Score review** | After 10 questions, every answer is shown with ✓ / ✗ and the correct value |
| **Confetti celebration** | `canvas-confetti` fires from three directions when score ≥ 8 / 10 |
| **Kid-friendly design** | Fredoka One + Nunito fonts; purple / pink / blue / aqua colour palette; floating bubble animation |
| **Angular routing** | Client-side routes; no 404 on refresh (SPA fallback configured in Azure) |

### Hint System

1. **"I need a hint"** — full multiplication table for the first factor appears; the answer row is blurred (`???`). The answer input remains visible so the kid can still submit once they work it out.
2. **"Still don't know?"** — question card hides; the complete table is shown for memorising
3. **"Got it!"** — table hides; the question reappears with the input ready to type

Questions answered after using a hint are flagged with 💡 in the results review.

---

## Code Structure

```
tables-app/
├── public/
│   ├── favicon.ico
│   └── staticwebapp.config.json      # SPA fallback routing for Azure Static Web Apps
├── src/
│   ├── index.html                    # Google Fonts (Fredoka One + Nunito)
│   ├── styles.scss                   # Global CSS custom properties, shared button/card classes, keyframe animations
│   └── app/
│       ├── app.ts                    # Root component — thin RouterOutlet shell
│       ├── app.routes.ts             # Route definitions (lazy-loaded components)
│       ├── app.config.ts             # ApplicationConfig — provideRouter, provideBrowserGlobalErrorListeners
│       ├── models/
│       │   └── question.model.ts     # Question { a, b, answer } and Answer { question, userAnswer, correct, hintUsed }
│       ├── services/
│       │   ├── quiz.service.ts       # Signal-based game state (questions, currentIndex, answers, score)
│       │   └── sound.service.ts      # Web Audio API tones — playCorrect(), playWrong(), playCelebration()
│       └── components/
│           ├── welcome/              # Home screen — animated bubbles, rules, Start button
│           ├── quiz/                 # 10-question quiz loop + hint state machine
│           │   └── hint-panel/       # Reusable table grid; blurs the answer row in partial-hint mode
│           └── results/              # Score badge, answer review list, confetti, Play Again
├── infra/
│   ├── main.bicep                    # Subscription-scoped entry point — creates resource group
│   ├── resources.bicep               # Azure Static Web App resource (Free SKU)
│   └── main.parameters.json          # azd parameter placeholders
├── azure.yaml                        # azd service definition
└── .azure/                           # azd environment state (auto-generated, not committed)
```

### Key Architectural Decisions

- **Angular 19 standalone components** — no NgModules; each component declares its own `imports`
- **Angular Signals** (`signal`, `computed`, `effect`) used throughout `QuizService` and component state — no RxJS needed
- **`@for` / `@if` control flow** — Angular 17+ template syntax used in all templates
- **Lazy-loaded routes** — welcome, quiz, and results are separate JS chunks; initial bundle is ~62 kB transferred
- **Web Audio API** — sound effects generated programmatically; zero audio file downloads
- **`canvas-confetti`** — ~3 kB npm package; only imported in `ResultsComponent`

---

## Running Locally

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20 LTS or later | https://nodejs.org |
| Angular CLI | 19+ | `npm install -g @angular/cli` |

### Steps

```bash
# 1. Install dependencies
cd tables-app
npm install

# 2. Start the development server (hot reload enabled)
npm start
# or: ng serve

# App opens at http://localhost:4200
```

> The dev server supports live reload. Any file change is reflected instantly in the browser.

### Running a production build locally

```bash
ng build --configuration production
# Output written to: dist/tables-app/browser/

# Serve with any static file server, e.g.:
npx serve dist/tables-app/browser
```

---

## Deploying to Azure

The app targets **Azure Static Web Apps** (Free tier) provisioned via **Azure Developer CLI (`azd`)** and Bicep.

### Prerequisites

| Tool | Install |
|---|---|
| Azure Developer CLI (`azd`) | `winget install Microsoft.Azd` (Windows) or https://aka.ms/azd |
| Azure CLI (`az`) | https://aka.ms/install-azure-cli |
| An Azure subscription | https://portal.azure.com |

### First-time deployment

```bash
# 1. Log in to Azure
azd auth login

# 2. Provision resources + deploy in one command
azd up
# Prompts: environment name, subscription, location
# Creates:  resource group rg-<env-name>
#           Azure Static Web App swa-<env-name>
# Deploys:  dist/tables-app/browser/ → Static Web App CDN
```

> **Note:** Azure Static Web Apps is not available in Australia East.  
> Use **East Asia (Hong Kong)** — `eastasia` — as the closest supported region.

### Re-deploying after code changes

```bash
# 1. Rebuild
ng build --configuration production

# 2. Deploy (no re-provisioning; ~90 seconds)
azd deploy
```

### Tearing down all Azure resources

```bash
azd down
# Deletes resource group rg-<env-name> and everything inside it
```

### Azure resources created

| Resource | Name | Cost |
|---|---|---|
| Resource Group | `rg-tables-app` | Free |
| Azure Static Web App | `swa-tables-app` | Free tier — $0/month |

---

## Scripts Reference

| Command | What it does |
|---|---|
| `npm start` | Dev server at `localhost:4200` with hot reload |
| `npm run build` | Production build → `dist/tables-app/browser/` |
| `npm run watch` | Incremental dev build (no server) |
| `npm test` | Unit tests via Vitest |
| `azd up` | Provision + deploy to Azure (first time) |
| `azd deploy` | Deploy only (resources already provisioned) |
| `azd down` | Delete all Azure resources |


## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
