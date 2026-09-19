# AGENTS.md — AI Assistant Skills & Instructions

Synthesized from: Superpowers, Taste Skill, Caveman, Claude Code Best Practice, Fabric, Headroom.
Source: https://docs.google.com/spreadsheets/d/1pllh2_ftiqjQEwhcDq4R5wgUltUry7cHwRNBki1-5YM

---

## 1. THINK BEFORE YOU CODE (Superpowers)

- Never jump straight into writing code. First understand the problem, ask clarifying questions, explore alternatives.
- Brainstorm - Spec - Plan - Execute - Review - Ship. Follow this workflow for every non-trivial task.
- Break work into small tasks (2-5 minutes each). Every task has exact file paths, what to change, and how to verify.
- YAGNI — You Aren't Gonna Need It. Don't build things just in case.
- DRY — Don't Repeat Yourself, but don't over-abstract either.

## 2. TEST-DRIVEN DEVELOPMENT (Superpowers)

- RED - GREEN - REFACTOR. Write a failing test first, watch it fail, write minimal code to pass, then refactor.
- Never write production code before tests unless the change is trivially small.
- Verify before declaring success. Run the tests. Don't just assume they pass.

## 3. CONCISE RESPONSES (Caveman)

- Drop the preamble. No "Great question!" or "Let me help you with that."
- Say what matters, skip what doesn't. Code, file paths, exact error messages stay full. Prose around them gets compressed.
- Security warnings and irreversible confirmations come back in full sentences. Everything else: brief.
- Never shorten code, paraphrase error messages, or grunt through security warnings.
- Format: File:line when referencing code. One finding per line for reviews.

## 4. DESIGN TASTE — ANTI-SLOP (Taste Skill)

- Layout first, then code. Understand the visual hierarchy before implementing.
- Strong typography — pick one font family, use size/weight for hierarchy, not color.
- Intentional spacing — consistent margins/padding, whitespace as a design element.
- No template-looking UIs — avoid generic card layouts, centered hero sections with gradient buttons.
- Motion with purpose — animations that guide attention, not decorative spinners.
- Dials: VARIANCE (layout experimentation), MOTION (animation depth), DENSITY (info per viewport).
- When in doubt: restraint > decoration. Less > more.

## 5. PROJECT-SPECIFIC RULES (MTT GAME)

### Code Style
- Courier New font, shadows 4px 4px 0 #000, vignette, XXL weapon, crosshair mix-blend-mode:difference, accent #ff9f1c
- Never delete saves: mtt_shop_v1, mtt_keys_v1, mtt_char, mtt_xp_v1, mtt_token
- NEVER commit secrets or keys.
- Commit convention: tag @MeMATT0 + link https://mtt.bratuxa.zomb.top/

### Build & Deploy
- Build: bun run build -> bun build ./index.html --outdir ./dist --minify
- Source changes are NOT live until build regenerates dist
- Server: ssh root@45.90.98.113 via key C:\Users\matt2\.ssh\id_ed25519
- Bun path on server: /root/.bun/bin/bun (not in PATH)
- Site served on port 8080 via Python router behind Caddy
- Push to GitHub -> webhook auto-deploys

### Architecture
- React 18 + Three.js 0.160 + TypeScript + Bun
- Mono-repo: only mtt.bratuxa.zomb.top subfolder matters
- Admin access: login MHM (Cyrillic) OR DEV panel (promocode LXX42P2ILX)
- Forest map: 200x200, InstancedMesh for trees (~6000 -> ~6 draw calls)

## 6. SYSTEMATIC DEBUGGING (Superpowers)

- 4-phase process: Reproduce - Hypothesize - Test - Fix
- Root cause tracing — don't fix symptoms, find the actual cause
- Defense in depth — add checks at multiple levels
- Condition-based waiting — don't use arbitrary delays, wait for conditions

## 7. CONTEXT MANAGEMENT (Claude Code Best Practice)

- Context rot kicks in around 300-400k tokens — don't let sessions drift past that
- Dumb zone at ~40% context — keep under 40%, wrap up at 60%
- Rewind > correct — go back to before the failed attempt and re-prompt
- New task = new session — don't carry stale context
- Use subagents for context management — offload work, keep main context clean
- Ask: "will I need this tool output again, or just the conclusion?"

## 8. GIT DISCIPLINE (Claude Code Best Practice)

- Keep PRs small and focused — p50 of 118 lines
- Always squash merge — clean linear history
- Commit often — at least once per hour
- One feature per PR — easier to review and revert

## 9. RESPONSE EFFICIENCY (Headroom + Caveman)

- Compress what you read — focus on relevant sections, skip boilerplate
- Compress what you write — drop throat-clearing, get to the point
- Output token reduction — don't restate context the user already provided
- Effort routing — full reasoning for complex problems, quick answers for simple ones
- When a simple question gets a long answer, you're doing it wrong

## 10. QUALITY GATES (Superpowers + Best Practice)

- Never declare success without verification
- Run lint and typecheck after code changes
- Check for existing patterns before adding new ones
- Security: never expose or log secrets and keys
- If a task takes >3 steps, use a todo list to track progress