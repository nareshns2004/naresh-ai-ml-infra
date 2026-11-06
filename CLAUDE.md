# portfolio-webapp — instructions for Claude Code

Put this file at the repo root as `CLAUDE.md`. Read it fully at the start of every session.

## How we work (read first)

I work on this site in short weekend sessions of **20–30 minutes**. So:

- At the start of a session, read `TODO.md` and propose doing **only the top unchecked item**. If it won't fit in ~25 minutes, split it and do the first half.
- Every session ends with the site in a deployable state and a clear commit message. No half-finished refactors.
- **Git workflow:** never commit to `main`. Work on a branch (`feature/<topic>` or `fix/<topic>`), push the branch, and give me the compare link. I open the PR, review the Vercel preview, and merge.
- At the end of a session, check off what was done in `TODO.md` and write one line under "Next session starts with:".
- When you need my input, ask one specific question. Don't block on it: leave a `TODO(naresh):` marker and move on.
- Create `TODO.md` in session 1 from the backlog below if it doesn't exist.

## Current state (as of Oct 2026)

- Static site, no build step. **Keep it that way for now.** A framework migration is out of scope unless I ask. Hosted on Vercel at https://portfolio-webapp-roan.vercel.app (canonical + OG URLs use it).
- `index.html` (homepage), `posts/*.html` (interactive posts), `assets/css/{site,home,post}.css`, `assets/js/{site,post,data,hero}.js`, `og-image.png` (rendered from `assets/og/og-source.html`), icons (`favicon.ico` 16/32/48, `assets/icons/icon-192.png`, `assets/icons/apple-touch-icon.png` on Paper; all generated from `assets/icons/naresh_website.png`), `design/visual-refresh-plan.html` (approved design reference, noindex).
- Homepage sections: hero + proof strip, Work ("Three problems I work on": reliability, efficiency, trust), Security (incident ticker + layered threat map, `assets/js/threatmap.js`), Writing (rendered from `assets/js/data.js`, with topic filters), Upstream & evidence, Toolbox (`#foundations`: skill → artifact map + unrated tool list), Profiles, Contact (role-to-proof links, locations, socials row). Section kickers are auto-numbered (§01…) by a CSS counter in `home.css`.
- Security data: `assets/js/security-data.js` holds the stack layers and the sourced incident list used by the threat map and `posts/ai-infra-breaches.html`. Every incident links its advisory / CVE / researcher write-up; add new ones there.
- Site-wide: command palette (⌘K / Ctrl+K / "/") and scroll-progress bar in `site.js`; every page loads `data.js` so the palette lists posts. Brand is an "NK" mark + "Naresh Kumar" (the old `naresh.infra` wordmark was retired Nov 2026).
- **Profiles (updated 5 Nov 2026, at my request):** GitHub, Hugging Face and LeetCode as profile cards, plus a socials row: LinkedIn, Substack, YouTube, Docker Hub and X (@naresh_swe24). These are back in footers, contact and JSON-LD `sameAs`. This supersedes the earlier removal.
- Visual system ("datasheet", approved Oct 2026): six named colors in `site.css` (Paper, Ink, Graphite, Signal = reliability/links/running, Copper = efficiency/in progress, Fault = failures only), light default + dark via system setting or nav toggle. IBM Plex Sans + IBM Plex Mono only. Widgets are numbered figures ("Fig. n", CSS counter). Use tokens, never raw hex, in page CSS; set SVG paint via `style` (or `P.svg`) so `var()` works.
- Hero "Fig. 0" (`hero.js`): ring loses a link → stall spreads → timeout → restore on spare → an unattested peer is denied while training continues, with a goodput timeline and a typed terminal line; static frame under reduced motion, paused off-screen.

## What the site is for

I'm a GPU cluster networking and distributed-training infrastructure engineer working below the framework layer (kernel networking, RDMA/RoCE, DPDK, SR-IOV, KVM, NCCL, GPU infra). Keep site copy timeless: no years-of-experience counts (my request, Nov 2026). The audience is hiring managers and staff engineers at AI labs and top infra teams. They give the site 10 seconds, then maybe 90, then maybe 10 minutes.

The site's one job is to turn a glance into a click on verifiable proof: a repo, a merged PR, a model card, a write-up. It is a funnel into proof-of-work, not a learning journal or a résumé.

The story is three-part (security added Nov 2026), mirroring how AI lab infra orgs are organized:
- **Reliability at scale**: fault-tolerant training orchestrator (fault injection, NCCL timeout signatures, DCGM telemetry, topology-aware checkpoint-restart), plus the Hugging Face incident classifier and root-cause reasoning model.
- **Efficiency at scale**: disaggregated inference engine (prefill/decode pools, RDMA KV-cache transfer, Triton fused attention).
- **Trust at scale**: secure AI/ML infrastructure: zero trust for GPU fabrics (RDMA trust model, memory windows), model artifacts (pickle vs safetensors), multi-tenant serving (prefix-cache side channels) and AI agents (blast radius, gated executors). Evidence: goodput's SECURITY.md invariants, kvwire ADR-0005, and the five security posts.

Kernel/eBPF/DPDK/RDMA depth is the *foundation* that makes all three stories credible. It is not the headline.

## Interactive posts

- One page per post under `posts/`, using `assets/css/post.css` and `assets/js/post.js`. Register it in `assets/js/data.js`, add it to `sitemap.xml`, and to the `<noscript>` list in `index.html`.
- Posts may use public facts (model configs, spec-sheet numbers, published papers, with a link) and closed-form models. Every widget gets a "Model & assumptions" box. No benchmark numbers I haven't measured; illustrative logs are labelled as such.
- Each post ends by linking the repo it relates to. Widgets must work with keyboard and under `prefers-reduced-motion`.

## Hard rules

- Never invent numbers, benchmarks, dates, or claims. Every claim on the page links to evidence (repo, PR, post, model card, image) or gets a `TODO(naresh): link evidence or cut` marker. If I don't supply the link, remove the claim.
- No element without a working destination: no `<a>` without `href`, no "Read post" to nowhere.
- No self-rated proficiency (percentages, bars, "x% complete"). Skills are shown through what they produced.
- Status is honest: "in progress" is fine and should link to the repo or build log.
- Keep or improve: meta description, Open Graph tags, JSON-LD Person schema, accessibility (alt text, focus states, contrast), and `prefers-reduced-motion`.

## Backlog (ordered by impact; one item ≈ one session)

1. **Stop the bleeding.** Fix or remove every dead link (the blog "Read post" anchors: link to the real Substack post if it exists, otherwise remove the card). Remove the proficiency percentages and the roadmap progress bar. (LeetCode was removed here, then restored at my request in Oct 2026; keep it.)
2. **Hero + proof strip.** Rewrite the hero so the first line is the problem I solve for GPU clusters (offer me 3 one-line options in a comment; I'll pick). Re-order the tags so GPU cluster networking / distributed training / NCCL / RDMA lead and eBPF/XDP follow. Add a proof strip directly under it with 3–4 linked facts: the merged vLLM PR #50618 (ROCm fault fix) ⚠ on GitHub #50618 is authored by JohnQinAMD and unmerged; needs the correct link, see TODO.md, years in kernel networking, plus one slot for `TODO(naresh)`.
3. **Replace "Infra Deep Dives" with "Two problems I work on."** Two blocks, Reliability at scale and Efficiency at scale. Each has problem (1 sentence), why it's hard (1 sentence), my approach (2–3 sentences), status, headline result *only if real*, and links (repo, related HF models, related posts). The topic descriptions from the old section can move into an "Areas" line under Foundations if worth keeping.
4. **Replace "Achievements" with "Upstream & evidence."** OSS first (vLLM PR, the cudagraph padding issue, the libbpf fix if I give the link). Each entry gets one line on what broke and what changed, plus a link. Any unlinkable item gets a `TODO(naresh)`.
5. **Replace Roadmap + Skills with "Foundations."** A compact evidence map: each skill area → the artifact that proves it (repo, post, PR). Areas without evidence are listed plainly with no rating, or cut.
6. **Developer Profiles cleanup.** GitHub, Hugging Face, LeetCode. (Superseded 5 Nov 2026: LinkedIn, Substack, YouTube, Docker Hub and X are back as a socials row. Google Developers stays removed.)
7. **First case study page** (`work/training-orchestrator.html`), only once the repo has something runnable. Fixed template: Problem → Why it's hard → Architecture (SVG or Mermaid) → Key decisions and trade-offs rejected → Results with methodology (hardware, topology, baseline, how measured) → What broke → What's next → Links. Link it from the Reliability block.
8. **Writing index.** Blog cards pull from a small JSON array (title, date, url, tag, summary) so adding a post is a one-line edit. Off-site write-ups use `kind: "external"`; don't duplicate content.
9. **Share preview.** A static Open Graph image (1200×630) and `twitter:card` set to `summary_large_image`.
10. **Visual refresh (last).** ✅ Done Oct 2026 (see `design/visual-refresh-plan.html`). Only after content is done. Propose a design plan first (4–6 named colors, 1–2 typefaces, wireframes, one memorable hero moment drawn from my world, such as a ring all-reduce losing a link and recovering from a checkpoint, kept lightweight and static under reduced motion). Move away from the generic dark-terminal dev look (JetBrains Mono + near-black). Wait for my approval before implementing; split across several sessions.
11. **Second case study** (`work/disaggregated-inference.html`) when that project has results.

Next session starts with: see TODO.md.
