/*
  Writing index. Adding a post is a one-line edit: append an object.
    kind: "interactive" → a page under posts/ on this site
          "external"    → links out to a write-up hosted elsewhere
    date: "YYYY-MM-DD"  (sorted newest first; featured posts are pinned first)
*/
window.POSTS = [
  { kind: "interactive", featured: true, date: "2026-10-03", tag: "Reliability", minutes: 8,
    title: "One dead link, 512 idle GPUs: ring all-reduce under failure",
    summary: "Cut a link in a live ring and watch every rank time out the same way. Symptoms are global, the cause is local.",
    url: "posts/ring-allreduce-failure.html" },
  { kind: "interactive", featured: true, date: "2026-10-03", tag: "Efficiency", minutes: 7,
    title: "The KV-cache bill: what disaggregated inference has to move",
    summary: "A calculator for the bytes prefill hands to decode and the wire time it costs, for real model configs and link speeds.",
    url: "posts/kv-cache-transfer.html" },
  { kind: "interactive", date: "2026-10-03", tag: "Fabric", minutes: 7,
    title: "PFC: the lossless network that can freeze itself",
    summary: "Step a toy RoCE fabric into a pause-frame deadlock, then turn on ECN and watch it stay up. Also: why the loudest port is often the victim.",
    url: "posts/pfc-deadlock.html" },
  { kind: "interactive", date: "2026-10-03", tag: "Reliability", minutes: 6,
    title: "How often should a 16K-GPU job checkpoint?",
    summary: "Young/Daly with sliders: cluster size, failure rate, checkpoint cost and restart cost, plotted as goodput.",
    url: "posts/checkpoint-interval.html" },
  { kind: "interactive", date: "2026-10-03", tag: "Reliability", minutes: 6,
    title: "Reading the crime scene: triaging an NCCL timeout",
    summary: "An incident drill. Every rank reports the same timeout; use GPU, NIC and NCCL signals to find the one that caused it.",
    url: "posts/nccl-timeout-triage.html" },
  { kind: "interactive", date: "2026-10-05", tag: "Fabric", minutes: 7,
    title: "Where NCCL traffic actually goes: rail-optimized vs fat-tree",
    summary: "Route ring, tensor-parallel and MoE all-to-all traffic over two fabrics and count what crosses the spine, with and without PXN.",
    url: "posts/rail-topology.html" },
  { kind: "interactive", date: "2026-10-05", tag: "Foundations", minutes: 8,
    title: "The packet path: kernel stack vs XDP vs DPDK vs RDMA",
    summary: "Step one packet through four datapaths: where each step runs, how many copies it costs, and what each path gives up.",
    url: "posts/packet-path.html" },
];
