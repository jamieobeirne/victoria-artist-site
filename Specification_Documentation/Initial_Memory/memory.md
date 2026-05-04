# Project Memory

## Vision and Experience Goal
Create a contemplative, unhurried website experience that invites visitors to stay and explore the illustrator's artistic trajectory. The interface must remain quiet and supportive, with the drawings as the primary visual focus at all times.

## Current Milestone (Static Prototype)
- Build a static design prototype using a small curated subset of images.
- Validate mood, visual language, and navigation approach before backend decisions.
- Prepare clear discussion inputs for Thursday's meeting on data model options and admin-panel needs.

## Design Principles
- Contemporary minimalist direction.
- Value-only palette: whites, greys, and near-blacks (never pure black).
- Sans-serif typography with text color at roughly 80-90% black.
- Strong contrast to support the artwork while keeping interface elements visually restrained.
- No decorative UI that competes with ink drawings.

## IA and Navigation (Two-Step Entry)
1. Entry screen: one strong image and a clear `ENTER` call to action.
2. Content layer: easy navigation to artwork and texts with low cognitive load.

Reference interaction model: [samanthakeelysmith.com](https://github.com/jamieobeirne/victoria-artist-site.git) entrance pattern (single-image gateway plus explicit entry action).

## AI Engineering Framework (7 Points)
This framework guides planning, build decisions, and quality checks.

### 1) Specification Precision and Clarity of Intent
- Keep requirements explicit per page/section (purpose, content, mood, constraints).
- Track non-negotiables: contemplative pacing, minimalist aesthetic, drawings first.
- Use acceptance checks before approval to prevent ambiguity.

### 2) Evaluation and Quality Judgment
- Judge output against experiential criteria, not only technical completion.
- Evaluate typography, spacing rhythm, contrast quality, and visual silence.
- Verify the prototype communicates artistic intent at first glance.

### 3) Multi-Agent Decomposition and Delegation
- Match task scope to role:
  - research/reference capture
  - layout and component draft
  - copy/content integration
  - QA against constraints
- Use handoff checklists so each stage receives validated inputs only.

### 4) Failure Pattern Recognition
- Run explicit checks for the six known failure patterns during implementation and review.
- Add checkpoints after each major step (entry screen, gallery flow, content wiring).

### 5) Trust and Security Design
- Treat all media metadata and future admin capabilities as security-sensitive.
- Plan principle-of-least-privilege for any future admin panel.
- Avoid exposing private asset paths or unnecessary data in front-end output.

### 6) Context Architecture
- Keep a stable, concise project memory document and reuse it as source-of-truth.
- Separate immutable constraints from changeable experiments.
- Refresh implementation context often to avoid drift in longer sessions.

### 7) Cost and Token Economics
- Keep prompts and artifact reviews scoped to immediate decisions.
- Prefer short iterative loops with acceptance checkpoints over long speculative runs.
- Reuse approved constraints to reduce repeated reasoning cost.

## Six Failure Patterns: Risks and Countermeasures

### 1) Context Degradation
Risk: long sessions dilute priority instructions and quality declines quietly.
Countermeasures:
- Re-anchor every major step to this memory file.
- Use concise session summaries and reset context between major phases.
- Keep active task lists short and explicit.

### 2) Specification Drift
Risk: implementation slowly diverges from original constraints.
Countermeasures:
- Validate each deliverable against the non-negotiables list.
- Use definition-of-done checks before marking work complete.
- Require explicit approval for any intentional scope or style deviation.

### 3) Sycophantic Confirmation
Risk: agreeing with flawed assumptions instead of correcting them.
Countermeasures:
- Challenge uncertain claims with evidence checks.
- Ask direct clarifying questions when decisions conflict with stated goals.
- Prefer objective criteria over tone matching.

### 4) Tool Call/Selection Errors
Risk: wrong tool choice or poor tool usage causing incorrect output.
Countermeasures:
- Declare tool purpose before execution.
- Use smallest-scope tool that solves the current step.
- Verify tool output before passing results downstream.

### 5) Cascading Failure
Risk: one bad intermediate artifact poisons the rest of the workflow.
Countermeasures:
- Introduce verification checkpoints at handoffs.
- Prevent downstream work from starting until upstream artifact passes checks.
- Keep rollback points for key decisions (layout, content structure, image mapping).

### 6) Silent Failure (Most Dangerous)
Risk: polished output hides critical factual or constraint errors.
Countermeasures:
- Run explicit "surface looks right but is it right?" checks.
- Compare final output against source constraints line by line.
- Add an independent review pass focused on hidden mismatches.

## Content and Asset Status
- Artist has texts ready.
- Artist has image registros ready.
- Initial prototype should use only a few selected images.
- Current social presence: Instagram only.

## Non-Goals (For This Week)
- No production database implementation.
- No admin panel implementation.
- No advanced CMS integration.
- No full archival ingestion of all images/texts.

## Thursday Meeting Prep: Database/Admin Questions
- What entities are needed first (artwork, series, text, exhibitions, press)?
- Which metadata fields are mandatory vs optional for each artwork?
- What publishing workflow is required (draft/review/publish)?
- Who will use admin and what permission levels are needed?
- Is multilingual content needed now or later?
- How often will new works be added?
- Should Instagram embeds be manual links or automated pulls in the future?

## Definition of Done (Prototype)
- Aesthetic matches minimalist, contemplative direction.
- Entry screen + clear second-step navigation is working and understandable.
- Interface does not compete with drawings.
- Typography and value palette stay within defined constraints.
- Prototype is simple to demo and discuss for next-phase architecture decisions.
