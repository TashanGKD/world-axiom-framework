<p align="center">
  <a href="https://tashan.ac.cn/homepage/" target="_blank" rel="noopener noreferrer">
    <img src="docs/assets/tashan.svg" alt="Tashan Logo" width="200" />
  </a>
</p>

<p align="center">
  <strong>Axiomatic Framework for Human-Agent Digital Worlds</strong><br>
  <em>数字世界公理体系</em>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#core-content">Content</a> •
  <a href="#ecosystem">Ecosystem</a> •
  <a href="#contributing">Contributing</a> •
  <a href="README.md">中文</a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-planned-lightgrey)

> 🔲 **This repository is a skeleton. Development has not started yet.**

---

## Overview

### Role in the Research Program

The "Human-Agent Hybrid Digital World" research program argues that building a serious digital world requires first constructing a **world substrate** that is formally coherent, structurally implementable, and methodologically verifiable.

This repository provides the **first layer of that substrate: the axiomatic framework (T–PA–G)**. Its task is not to describe any particular implementation, but to define what conditions **any** human-agent digital world must satisfy in principle.

Without this layer, the implementation structure (②) has no theoretical grounding; without ① and ②, the sandbox validation (③) has no reference standard.

### Core Design

The three-layer structure—Essential Goals (T) → Abstract Axioms (PA) → Current System Requirements (G)—ensures:

- **T and PA layers**: Implementation-independent; reusable across versions and systems
- **G layer**: Bound to the current implementation; updated as the system evolves
- **Three registers**: The same framework is legible in mathematical (state spaces, evolution operators), physical (open coupled dynamical systems), and computational (safety, liveness, write-boundary legality) terms

---

> ### 🌟 Key Insight: Any Social Scenario = A Set of Parameter Values
>
> The most powerful engineering implication of this axiom framework: **any multi-agent interaction scenario in the digital world does not need a dedicated system definition — just provide a few FieldProfile dimension values, and the system's behavior is automatically self-consistent.**
>
> Meetings, group chats, forums, GitHub PRs, academic roundtables, private messages — these seemingly different scenarios are all just different coordinate points in the same parameter space:
>
> | Scenario | FieldProfile values |
> |----------|-------------------|
> | Online group chat | `visibility=restricted, co_presence=sync, task_binding=none` |
> | Forum / BBS | `visibility=global, co_presence=async, persistence=durable` |
> | Online meeting | `turn_taking=moderated, co_presence=sync, formality=0.8` |
> | GitHub PR | `task_binding=strong, turn_taking=sequential, visibility=global` |
> | Private message | `visibility=private, audience_size=2, co_presence=async` |
>
> The axioms guarantee that **any combination of parameter values produces self-consistent behavior** — no need to write separate rule code for each social product.

---

## Core Content

> 📋 Planned structure, to be filled in as development progresses.

- `T-layer/` — Essential goals (definability, legality, sustained evolution, open evolution, effective coupling)
- `PA-layer/` — Abstract axioms (write isolation, unique source of truth, interface completeness, etc.)
- `G-layer/` — Current system requirements (tied to ②)
- `mappings/` — T→PA→G traceability matrix
- `formalization/` — Mathematical notation (optional extension)

---

## Ecosystem

| Layer | Project | Repository | Type | Status |
|-------|---------|-----------|------|:------:|
| World Substrate | **① Axiom Framework** ← this repo | [world-axiom-framework](https://github.com/TashanGKD/world-axiom-framework) | Open Source | 🔲 |
| World Substrate | ② Architecture | [world-three-particle-impl](https://github.com/TashanGKD/world-three-particle-impl) | Open Source | 🔲 |
| World Substrate | ③ Sandbox Validation | [world-sandbox-validation](https://github.com/TashanGKD/world-sandbox-validation) | Open Source | 🔲 |
| Digital Twin | ④ Bootstrap (0→1) | [digital-twin-bootstrap](https://github.com/TashanGKD/digital-twin-bootstrap) | Open Source | 🟡 |
| Digital Twin | ⑤ Iteration (1→100) | [digital-twin-iteration](https://github.com/TashanGKD/digital-twin-iteration) | Open Source | 🔲 |
| Core App | Digital World | TashanGKD/tashan-world (private) | Private | 🔲 |
| Commercial | Twin Platform | TashanGKD/tashan-twin-platform (private) | Private | 🔲 |
| Public Interest | Tashan Forum | [tashan-forum](https://github.com/TashanGKD/tashan-forum) | Open Source | 🔲 |

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon).

---

## License

MIT License. See [LICENSE](LICENSE) for details.
