# TODO

Backlog from CLAUDE.md, ordered by impact.

- [x] 1. **Stop the bleeding.** Dead links, proficiency %, roadmap progress bar removed.
- [x] 2. **Hero + proof strip.** Problem-first hero (3 options in an HTML comment), tags re-ordered, proof strip (goodput, nicprof, kvwire, HF models). Upstream slot is a `TODO(naresh)`; see below.
- [x] 3. **"Two problems I work on."** Reliability (goodput) and Efficiency (kvwire), honest status, linked.
- [x] 4. **"Upstream & evidence."** nicprof, kptk, LinuxMemoryManager PR #10. vLLM / cudagraph / libbpf entries wait on links.
- [x] 5. **"Foundations."** Skill area → artifact, with stage (runnable / design / early / write-up). Roadmap + Skills removed.
- [x] 6. **Profiles.** Proof of work: GitHub, Hugging Face, LeetCode. Social: LinkedIn, Substack, X. Docker Hub + Google Developers removed.
- [ ] 7. **First case study page** (`work/training-orchestrator.html`), once goodput has something runnable (M2+).
- [x] 8. **Writing index.** `assets/js/data.js`; 5 interactive posts + 4 Substack posts.
- [x] 9. **Share preview.** `og-image.png` (1200×630), `summary_large_image`.
- [x] 10. **Visual refresh.** "Datasheet" direction approved and built in 4 commits: tokens & type, homepage components, hero Fig. 0, posts & OG image.
- [ ] 11. **Second case study** (`work/disaggregated-inference.html`) when kvwire has results.

## New ideas

- [x] Post: "The packet path: kernel stack vs XDP vs DPDK vs RDMA" (`posts/packet-path.html`).
- [x] Post: rail-optimized vs fat-tree topology explorer (`posts/rail-topology.html`).
- [x] Site gaps: `robots.txt`, `sitemap.xml` (update when adding a post), custom `404.html`.
- [ ] When goodput / kvwire publish a first measured result, add it to the proof strip with a link to the run directory.
- [x] Hugging Face update: infra-incident-intel in proof strip, Reliability block (Models row + Space links), Foundations and Profiles; "Interactive notes" wording replaced site-wide.
- [ ] When `infra-failure-bench` or the triage model is published on the Hub, link it directly from the Reliability block and Foundations.
- [x] Nov 2026 refresh: removed LinkedIn, Substack and X site-wide; removed dead links (infra-incident-intel repo 404, infra-triage-demo / infra-rca-demo Spaces, NCCL-RCA model) and pointed them at the `qwen3-nccl-rca-lora` model card; dropped the false "6 model cards / 6 Spaces" row; numbered section kickers, wider featured posts, card hover, balanced headings.

- [x] **Nov 2026 security refresh** (`feature/secure-ai-infra`): new hero line ("can’t be stalled, slowed, or stolen"; 3 options in an HTML comment), "NK" brand replaces `naresh.infra`, Trust-at-scale block, §Security threat map + incident ticker, five security posts (breach field guide, agent blast radius, pickle disassembler, RDMA trust model, prefix-cache side channel), Toolbox with security rows, socials row (LinkedIn, Substack, YouTube, Docker Hub, X), ⌘K palette, writing filters, hero intruder phase + terminal, OG image re-rendered.
- [ ] Add the security posts' one-line claims to goodput / kvwire READMEs where they belong (e.g. goodput RCA tier "recommends, never acts" is marked planned on the site; land it in the repo's design docs).
- [ ] When kvwire decides ADR-0005 (memory-window fencing), update the Trust block and the RDMA post with the measured bind cost.
- [ ] Profile README badge still says `naresh.infra`; rename to match the site.
- [x] **Contact refresh** (`feature/contact-socials-timeless-bio`): socials row moved from Profiles to Contact, replacing the email / LinkedIn / GitHub buttons; each role type links to its proof; hero bio no longer states a year count.

## Open questions for Naresh

- **Toolbox list:** the AI-infra-security tool list (SPIFFE/SPIRE, Falco/Tetragon, Sigstore/SLSA, confidential computing…) was added in the Nov 2026 refresh. Prune anything you can't defend in an interview.

- **vLLM PR #50618**: on GitHub it's by JohnQinAMD and unmerged. Did you contribute under another account, or is it a different PR number? Send the link and it becomes the first proof item.
- Links for the **cudagraph padding issue** and the **libbpf BTF fix**, if they exist.
- ~~Hero line~~: done, blend of A + C.
- **Hugging Face:** the profile has one model repo (`qwen3-nccl-rca-lora`, README only) and no Spaces. If `infra-incident-intel` or the Spaces are private rather than gone, make them public and re-link.
- The removed write-ups (DPDK, virtualization, LLM OS, AI infra roadmap essays; XDP / DPDK PMD / RDMA / RoCE / SR-IOV drafts): rebuild any worth keeping as an on-site post, or add as `kind: "external"` in `data.js`.

Next session starts with: review the Vercel preview of `feature/contact-socials-timeless-bio`, then prune the Toolbox list and work through the open questions above (vLLM PR link) and the over-claiming READMEs in kernel-level-ai-traffic-shaper and distributed-training-framework-nccl.
