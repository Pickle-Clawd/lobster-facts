# CLAUDE.md — Lobster Facts

## What Is This?

**Lobster Facts** — A beautiful, public-facing website that serves one random lobster fact per visit. Some facts are real, some are completely fabricated. There's no game element — just pure, delightful lobster knowledge (or "knowledge").

**Target URL:** https://lobsterfacts.thepickle.dev

## Design Vision

This site needs to look and feel AMAZING. Think: **deep ocean bioluminescence meets modern editorial design.**

### Key Design Elements:
- **Underwater atmosphere** — dark deep-sea background with subtle bioluminescent particles/jellyfish/plankton floating around
- **Three.js or WebGL** — interactive underwater scene as the background (subtle, not overwhelming). Particles that react to mouse movement. Think deep sea documentary vibes.
- **Typography-forward** — the fact itself should be the hero. Big, beautiful serif font for the fact text. Think editorial/magazine quality.
- **Color palette:** Deep navy/black background (#050a15), bioluminescent blues and teals (#00fff0, #0066ff), warm coral accents (#ff6b4a), soft white text
- **Subtle animations:** Facts fade/float in like they're emerging from the deep. The "new fact" button has a satisfying interaction.
- **Sound design (optional):** Subtle underwater ambient on hover/click (with mute toggle)

### Unique Tech Stack — THIS IS KEY:
Use a stack that makes this site technically distinctive:

- **Astro** — Static site framework (blazing fast, partial hydration)
- **Three.js** (via `@astrojs/react` island + `@react-three/fiber`) — For the underwater background scene
- **View Transitions API** — Native browser page transitions for that smooth feel
- **Custom GLSL shaders** — For water caustics/ripple effects
- **Vercel adapter** (`@astrojs/vercel`) — For edge deployment + API routes

### Page Structure:
1. **Main page (`/`)** — Shows one random fact, big and beautiful. "New Fact 🦞" button below. Simple footer with credits.
2. **Individual fact pages (`/fact/[id]`)** — For sharing specific facts. Same design but with a specific fact loaded.
3. **API route (`/api/random`)** — Returns a random fact as JSON (for fun, let people build on it)

### The Facts:
Create a JSON file with 50-100 lobster facts. Mix of:
- **Real facts** (lobsters can live 100+ years, they taste with their feet, their blood is blue, etc.)
- **Fake facts** (lobsters invented WiFi, they can do calculus, they have a secret society, etc.)
- Each fact has: `id`, `text`, `isReal` (boolean, not shown to users but in the data)
- Make the fake ones convincing enough to be believable, and the real ones weird enough to seem fake

### UI Elements:
- Big centered fact text
- "🦞 New Fact" button (with satisfying hover/click animation)
- Share button (copies link to `/fact/[id]`)
- Small counter: "Fact #42" 
- Footer: "Made by Clawd 🦞 — a lobster with WiFi and opinions" + link to clawd.thepickle.dev
- Mobile responsive (obviously)

## Commands

```bash
npm run dev      # Dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Deployment

- Deployed on **Vercel** via GitHub integration
- Domain: `lobsterfacts.thepickle.dev` (Cloudflare DNS)

## Notes

- Keep the bundle small — Astro's partial hydration helps here
- The Three.js scene should be an interactive island, not blocking initial render
- Facts load from a local JSON file (no database needed for v1)
- Make sure the share URLs work with proper OG meta tags per fact
