# GTT Network Transformation Studio

Enterprise network transformation workshop workspace. Built with React + Vite, deployed via Railway.

## Quick Start (Local)

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

## Production Build

```bash
npm run build    # Outputs to /dist
npm start        # Serves via Express on PORT (default 3000)
```

---

## GitHub Setup

### 1. Create the repository

```bash
# From project root
git init
git add .
git commit -m "Initial commit — GTT Network Transformation Studio v1.0"

# Create repo on GitHub (use GitHub CLI or web UI)
gh repo create gtt-network-transformation-studio --private --source=. --push

# Or manually:
git remote add origin git@github.com:YOUR_ORG/gtt-network-transformation-studio.git
git branch -M main
git push -u origin main
```

### 2. Protect the main branch (recommended)

```bash
# Via GitHub CLI
gh api repos/YOUR_ORG/gtt-network-transformation-studio/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field enforce_admins=true
```

---

## Railway Deployment

### Option A: One-click deploy from GitHub

1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `gtt-network-transformation-studio`
4. Railway auto-detects the Dockerfile and deploys
5. Click **Settings** → **Generate Domain** for a public URL

### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your repo
railway link

# Deploy
railway up

# Open in browser
railway open

# Set custom domain (optional)
railway domain
```

### Option C: Manual Docker deploy to any server

```bash
# Build the image
docker build -t gtt-studio .

# Run locally
docker run -p 3000:3000 gtt-studio

# Push to your registry
docker tag gtt-studio your-registry.com/gtt-studio:latest
docker push your-registry.com/gtt-studio:latest
```

---

## Railway Environment Variables

Set these in the Railway dashboard under **Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Auto-set | Railway sets this automatically |
| `VITE_ANTHROPIC_API_KEY` | Optional | For AI Analysis feature |

---

## Project Structure

```
gtt-network-transformation-studio/
├── public/                  # Static assets
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main application (monolith — see refactoring notes)
│   ├── tokens.js           # Design tokens, constants, shared styles
│   ├── data/
│   │   └── initialData.js  # All initial workshop data (sites, providers, tools, attendees)
│   ├── components/         # Shared UI components (refactoring target)
│   │   └── (Ring, Bar, Chip, Disc, Nts, ScoreRow, Decision, etc.)
│   └── views/              # Section views (refactoring target)
│       └── (CmdCenter, ExecView, CurrentView, NetView, SecView, CldView, etc.)
├── index.html              # HTML entry
├── server.js               # Production Express server
├── vite.config.js          # Vite build config
├── Dockerfile              # Container build
├── railway.toml            # Railway deploy config
├── nixpacks.toml           # Alternative Railway config
├── package.json
├── .gitignore
├── .env.example
└── README.md
```

---

## Architecture Notes for IT Team

### Current State: Working Monolith

`src/App.jsx` contains the entire application as a single file (~720 lines). This was built as a rapid prototype and is fully functional. The data models and component patterns are clean and consistent.

### Recommended Refactoring Path

**Phase 1 — Extract shared components** (low risk, high value)
```
src/components/Ring.jsx
src/components/Bar.jsx
src/components/Chip.jsx
src/components/Disc.jsx          # Disclosure/collapsible card
src/components/Nts.jsx           # Draggable notes field
src/components/PrimaryCard.jsx
src/components/ScoreRow.jsx
src/components/Decision.jsx
src/components/Findings.jsx
src/components/Chk.jsx           # Checkbox item
src/components/AIBtn.jsx         # AI Analysis button
src/components/InvTable.jsx      # Inventory table
src/components/Sidebar.jsx
src/components/Header.jsx
```

**Phase 2 — Extract views** (medium risk)
```
src/views/CommandCenter.jsx
src/views/RolesView.jsx
src/views/ExecView.jsx
src/views/CurrentView.jsx
src/views/NetView.jsx
src/views/SecView.jsx
src/views/CldView.jsx
src/views/SimpleView.jsx
```

**Phase 3 — State management** (higher risk, do when needed)
- Move shared state from App to React Context or Zustand
- Each domain module reads only its context slice (sparse attention)
- Consider `useReducer` for complex domain state

**Phase 4 — Backend + persistence**
- Add Express API routes or connect to a database
- Move AI Analysis calls server-side (secure API key)
- Add user authentication
- Add session save/load
- WebSocket for multi-user collaboration

### Data Architecture

All workshop data is held in App-level `useState` and passed down via props:

| Data | Source | Consumed By |
|------|--------|-------------|
| `sites` | Current Estate | Network (clusters), Command Center |
| `providers` | Current Estate | Network (provider assessment) |
| `netEls` | Network | Command Center (stats), Maturity |
| `secTools` | Security | Command Center (stats), Maturity |
| `cloudRes` | Cloud | Command Center (stats), Maturity |
| `*Findings` | Each tower | Command Center (total count) |
| `*Attendees` | Roles | Sidebar (counts) |

### Sparse Attention Architecture

The app is designed so each domain can be reasoned over independently:

- **Modular context blocks**: Network, Security, and Cloud are self-contained
- **Summary-first**: Collapsed `Disc` components show one-line summaries
- **Three-tier disclosure**: Primary (always visible) → Secondary (one-click) → Tertiary (collapsed)
- **Future AI copilot**: Can operate on a single domain's context slice without loading full workspace

### Design System

All styling uses inline `style` objects with tokens from `src/tokens.js`. No CSS framework. Consistent primitives:

- `T.tp` / `T.ts` / `T.td` — text hierarchy (primary/secondary/dim)
- `T.blue` / `T.red` / `T.violet` — tower accent colors
- `T.f` / `T.m` — font families (DM Sans / DM Mono)
- `Disc` component — the core collapsible card pattern
- `Nts` component — draggable notes with resize handle

---

## Workshop Modules

| Module | Purpose |
|--------|---------|
| **Command Center** | Overview with domain definitions, goals, and navigation |
| **Roles & Attendees** | Customer + GTT team roster with role dropdowns |
| **Executive Context** | Business drivers, risk assessment, ambition scale |
| **Current Estate** | Site inventory, providers, contracts, constraints |
| **Network Transformation** | SD-WAN readiness, site migration, decisions, branch checklist |
| **Security Transformation** | SASE/SSE scores, vendor consolidation, Zero Trust checklist |
| **Cloud Transformation** | Cloud readiness, connectivity, app migration, architecture decisions |
| **Future-State Blueprint** | Target architecture, branch model, convergence vision |
| **Value & Tradeoffs** | TCO/ROI, business case, tradeoff matrix |
| **Roadmap** | Phased rollout, dependencies, milestones |
| **Deliverables** | Output artifact tracking |

---

## License

Proprietary — GTT Communications, Inc.
