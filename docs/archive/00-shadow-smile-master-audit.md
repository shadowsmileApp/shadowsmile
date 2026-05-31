# ShadowSmile — Master Audit v2
## Source of Truth + AI Operating Constitution

**Project Status:** Active Development  
**Current Stage:** Functional Alpha  
**Architecture:** Next.js + Supabase + Vercel  
**Audit Version:** v2  
**Last Updated:** May 2026

---

# 1. PROJECT IDENTITY

## What ShadowSmile Is

ShadowSmile is an emotionally dual-expression social platform.

It is **not** intended to be a generic clone of existing social media.

The platform is built around a core emotional concept:

Users may express:

### Shadow
The hidden, vulnerable, difficult, painful, private, uncertain, darker, emotionally honest side of themselves.

### Smile
The hopeful, uplifting, positive, successful, brighter, expressive side of themselves.

ShadowSmile exists to support emotional authenticity and duality.

The platform philosophy assumes:

> People are not one-dimensional.

People experience joy and pain simultaneously.

Most social media optimizes for performance, appearance, engagement addiction, or identity signaling.

ShadowSmile aims to explore:

- emotional honesty
- authenticity
- private identity control
- nuanced self-expression
- emotional duality
- psychologically safer social experiences

This philosophy must influence:

- product decisions
- UX decisions
- feature decisions
- moderation decisions
- privacy systems
- social mechanics
- recommendation systems
- engagement systems

Future development must preserve platform identity.

AI helpers must avoid accidentally steering ShadowSmile toward becoming:

- generic Twitter/X
- generic Instagram
- generic Reddit
- generic Discord

ShadowSmile should remain meaningfully differentiated.

---

# 2. REALITY PROTOCOL (CRITICAL)

## Reality > Assumptions

All future development guidance must follow:

### Code Reality
The actual codebase is the truth.

Never assume systems exist because they are common in social media apps.

Verify implementation.

### Database Reality
Supabase schema is truth.

Verify:
- tables
- columns
- relationships
- RLS
- permissions
- data flow

before making architectural claims.

### Runtime Reality
If a feature exists in code but has not been verified through testing:

It is **implemented but unverified**.

Do not falsely mark systems complete.

### Product Reality
Do not invent progress.

Document:

- what exists
- what partially works
- what is scaffolded
- what is unverified
- what is broken
- what is missing

Accuracy matters more than optimism.

---

# 3. AI OPERATING CONSTITUTION

## Mandatory Behavior For All AIs Assisting ShadowSmile

Any AI helping this project must behave as:

### Sharp-Eyed
Notice hidden problems.

Look for:
- architecture flaws
- auth issues
- security holes
- weak UX
- bad state management
- performance issues
- scalability problems
- emotional safety risks
- feature inconsistency

### Detailed
Avoid vague answers.

Explain:
- tradeoffs
- consequences
- hidden risks
- alternative approaches
- future impact

### Thorough
Inspect before advising.

Do not rush to solutions.

Understand:
- code structure
- feature relationships
- platform philosophy
- database structure
- app flow

### Skeptical
Do not assume things work.

If something exists:

verify it.

Examples:

Bad:
> Messaging exists so DMs work.

Good:
> Messaging route exists, but delivery, persistence, unread state, permissions, and UX still need verification.

### Founder-Minded
Think beyond code.

Evaluate decisions through:

- product
- growth
- UX
- trust
- moderation
- scale
- long-term maintenance
- technical debt

### Systems-Aware
Understand interconnected systems.

Example:

Private accounts affect:

- profiles
- followers
- posts
- search
- comments
- reactions
- messaging
- visibility permissions

Never think in isolated features.

---

## Mandatory Rules For All AIs

### Rule 1 — Never Hallucinate Features

Never assume a system exists.

Verify first.

### Rule 2 — Inspect Before Advising

Understand the implementation before giving direction.

### Rule 3 — Be Proactive

Do not wait to point out risks.

If something appears weak:

say it.

Examples:
- insecure auth
- weak RLS
- broken privacy logic
- messy architecture
- dangerous UX
- scalability concerns

### Rule 4 — Think Long-Term

Avoid advice that creates future technical debt.

### Rule 5 — Protect Platform Identity

Do not accidentally turn ShadowSmile into generic social media.

### Rule 6 — Prioritize Reality

Real implementation matters more than ideal architecture diagrams.

---

# 4. VERIFIED CURRENT STATE OF SHADOWSMILE

## Current Development Stage

ShadowSmile is currently in:

# Functional Alpha

Meaning:

Core systems exist and are partially functioning.

However:

Full verification and production reliability are not yet confirmed.

This is **not** a prototype.

This is **not** a finished beta.

The project is beyond MVP thinking and entering:

> verification, refinement, reliability, and architecture hardening.

---

## Verified Infrastructure

Current verified stack:

### Frontend
- Next.js App Router
- React
- TypeScript

### Backend
- Supabase

### Hosting
- Vercel

### Tooling
- Husky git hooks

### State
- functional application structure exists

---

## Verified Implemented Systems

The following systems exist in code and have shown at least partial functionality.

### Authentication
Implemented:

- sign in
- sign up
- reset password

Status:

> implemented, partially verified

---

### Profiles
Implemented:

- profile pages
- handle system
- avatar support
- bio support
- display names
- private account system

Status:

> implemented, partially verified

---

### Posting System
Implemented:

- post creation
- post pages
- image support
- post types
- emotional posting structure

Status:

> implemented, partially verified

---

### Engagement System
Implemented:

- comments
- reactions

Status:

> implemented, partially verified

---

### Social Graph
Implemented:

- follow system
- follower relationships
- private account groundwork

Status:

> implemented, partially verified

---

### Discovery
Implemented:

- search page

Status:

> implemented, partially verified

---

### Messaging
Implemented:

- messages page

Status:

> implemented, insufficiently verified

End-to-end behavior still requires confirmation.

---

### Navigation
Implemented:

- BottomNav
- LayoutShell
- route system

Status:

> functioning foundation exists

---

# 5. VERIFIED DATABASE TRUTH

## Current Public Tables

Verified tables:

### profiles
Purpose:
Stores user identity and profile data.

Verified columns:

- id
- handle
- avatar_url
- created_at
- email
- role
- display_name
- bio
- is_private

---

### posts
Purpose:
Stores user-created content.

Verified columns include:

- content
- shadow_text
- smile_text
- post_type
- status
- image_url

Important:

ShadowSmile already contains platform differentiation at the database level.

The emotional dual-expression model is part of the product architecture.

This is not generic posting.

---

### comments
Purpose:
User discussion and interaction system.

Verified:
relationship to users and posts exists.

---

### followers
Purpose:
Social graph and account relationships.

Verified:
follow/follower relationship exists.

---

### reactions
Purpose:
Post engagement system.

Verified:
reaction type structure exists.

---

# 6. CURRENT DEVELOPMENT DOCTRINE

Immediate priority order:

1. verification
2. bug hunting
3. privacy/security hardening
4. UX consistency
5. architecture cleanup
6. performance
7. scale preparation

At this stage:

New features should not blindly outrun reliability.

Stability and verification matter.

The app must become trustworthy before becoming larger.

---

# 7. PRODUCT PHILOSOPHY

## Core Product Philosophy

ShadowSmile is built around:

> authentic emotional self-expression without becoming therapy social media.

The platform should encourage people to show more than one dimension of themselves.

Not only:

- success
- aesthetics
- status
- curated identity
- performance

But also:

- nuance
- honesty
- vulnerability
- humor
- struggle
- growth
- contradiction
- complexity

People are not emotionally singular.

ShadowSmile acknowledges:

> someone can be struggling and hopeful at the same time.

The product should support emotional duality.

---

## Shadow + Smile Principle

The platform identity revolves around two emotional dimensions:

### Shadow
Represents:

- hidden feelings
- uncertainty
- pain
- fears
- vulnerable thoughts
- difficult emotions
- emotionally honest experiences

Shadow should feel:

> safe, real, honest, and human.

Not:

> exploitative, doom-focused, or emotionally manipulative.

---

### Smile
Represents:

- hope
- joy
- wins
- humor
- excitement
- growth
- positivity

Smile should feel:

> uplifting and genuine.

Not:

> fake perfection or forced positivity.

---

## Platform Identity Rules

ShadowSmile must avoid becoming:

### Generic Twitter/X
Avoid:
- rage bait
- outrage optimization
- algorithmic toxicity
- shallow engagement loops

---

### Generic Instagram
Avoid:
- fake perfection
- aesthetic pressure
- identity performance culture
- comparison-first UX

---

### Therapy Social Media
Avoid:
- clinical framing
- emotional diagnosis systems
- crisis-centered platform identity
- forced vulnerability

ShadowSmile is:

> emotionally intelligent social media

Not:

> therapy social media.

---

## Emotional Safety Doctrine

ShadowSmile should be psychologically aware.

But:

It should not feel clinical.

Good platform feelings:

- safe
- expressive
- honest
- warm
- reflective
- authentic
- socially human

Bad platform feelings:

- emotionally exploitative
- guilt inducing
- performative vulnerability
- toxic positivity
- trauma farming
- emotionally manipulative

Future AI guidance must protect emotional balance.

---

# 8. ENGINEERING STANDARDS

## Development Philosophy

Build:

> stable systems before flashy complexity.

Avoid:

> feature chaos.

ShadowSmile is now in a stage where:

verification and reliability matter more than feature speed.

New systems should be built carefully.

---

## Architecture Standards

Prefer:

### Modular Components
Avoid giant files.

Break systems into:

- reusable UI
- feature-specific logic
- isolated concerns

Good:

```txt
components/
app/components/
lib/
```

Bad:

1,500-line page files doing everything.

---

### Separation of Concerns

Frontend:
- UI
- interactions
- rendering

Backend:
- data
- permissions
- mutations

Database:
- truth

Avoid mixing responsibilities unnecessarily.

---

### Server / Client Discipline

Use server logic when appropriate.

Avoid unnecessary client-side data exposure.

Be intentional with:

- Supabase client
- server client
- auth state
- permissions

Current verified structure:

```txt
lib/
├── supabase.ts
└── supabase-server.ts
```

This separation should remain clean.

---

## Feature Building Rules

Before building new features:

Ask:

### Does this fit ShadowSmile identity?

### Does this increase technical debt?

### Does this affect privacy?

### Does this scale?

### Does this interact with private accounts?

### Does this affect moderation?

### Does this affect emotional safety?

Never think about features in isolation.

---

## Backup Discipline

Current backup behavior exists:

```txt
docs/backups/
```

This is good.

Before risky changes:

Create backups.

Especially for:

- auth
- routing
- database logic
- feed logic
- profile systems
- navigation

Avoid reckless edits to stable systems.

---

## Database Discipline

Supabase is source of truth.

Before changing schema:

Think through:

- migration impact
- backward compatibility
- privacy implications
- permissions
- data integrity

Avoid impulsive database changes.

---

## File Organization Standard

Prefer predictable structure.

Current verified structure:

```txt
app/
components/
lib/
docs/
public/
temp/
```

Keep systems organized.

Avoid random file sprawl.

---

## Temporary Files Rule

Current temporary tooling exists:

```txt
temp/set-admin.js
```

Allowed:

temporary scripts.

Not allowed:

temporary scripts becoming permanent hidden dependencies.

Temp files should eventually become:

- documented
or
- removed

---

# 9. FEATURE VERIFICATION DOCTRINE

## Implemented ≠ Verified

Critical rule:

A feature existing in code does not mean:

> it works correctly.

Future AIs must separate:

### Implemented
Exists in code.

### Functional
Works under normal use.

### Verified
Tested across scenarios.

### Production Reliable
Stable under edge cases.

---

## Verification Checklist

Every feature should eventually be tested for:

### Authentication

Does auth:

- fail safely?
- refresh correctly?
- persist?
- redirect properly?
- protect restricted pages?

---

### Database Behavior

Does data:

- save correctly?
- update correctly?
- fail safely?
- handle nulls?
- avoid corruption?

---

### Permissions

Can users access:

only what they should?

Especially:

- private accounts
- followers
- messages
- posts
- profile visibility

---

### Mobile UX

Does it work on:

- phones
- narrow screens
- touch interactions

ShadowSmile should remain mobile-first.

---

### Edge Cases

What happens if:

- image missing
- user deleted
- profile incomplete
- network slow
- auth expired
- post deleted
- comment missing
- follower removed

Edge cases matter.

---

# 10. BUG-HUNTING DOCTRINE

Future AIs should actively inspect for:

## Authentication Bugs

Examples:

- redirect loops
- stale sessions
- bad logout behavior
- expired tokens
- broken reset-password flows

---

## Private Account Bugs

Critical area.

Future AIs must aggressively inspect for:

- visibility bypasses
- unauthorized profile access
- follower permission failures
- private post leakage
- search leakage

Private systems must be trustworthy.

---

## Database / Supabase Bugs

Watch for:

- broken relationships
- orphaned rows
- null failures
- bad joins
- inconsistent state
- duplicate reactions
- broken follower logic

---

## UI Bugs

Look for:

- hydration errors
- loading state failures
- layout breaks
- mobile inconsistencies
- navigation confusion

---

## Performance Problems

Watch for:

- unnecessary re-renders
- repeated queries
- slow page loads
- excessive client fetching

---

## Product Consistency Problems

Ask:

> Does this feel like ShadowSmile?

Or:

> Does this feel like generic social media?

Protect product identity.

---

# 11. SECURITY & PRIVACY DOCTRINE

ShadowSmile is a social platform.

Trust matters.

Privacy matters.

Security matters.

---

## Minimum Expectations

Assume:

users will eventually store personal information.

Therefore:

privacy systems must be taken seriously.

---

## RLS Expectations

Future AIs must verify:

Row Level Security policies.

Especially for:

- profiles
- followers
- posts
- reactions
- comments
- messages

Never assume permissions are safe.

Verify.

---

## Private Accounts

Current verified system:

```txt
profiles.is_private
```

Future AIs must treat private account integrity as:

> high priority.

Private means private.

No accidental leakage.

---

## Secret Handling

Never expose:

- API keys
- service role keys
- secrets
- environment variables

Respect:

```txt
.env.local
.env.example
```

Never commit secrets.

---

# 12. KNOWN UNKNOWNS

The following systems appear implemented but are not fully verified:

- messaging
- search
- follow edge cases
- private-account edge cases
- reset-password reliability
- permission edge cases
- mobile UX consistency

Assume:

> partially functional until verified.

Do not overclaim reliability.

Future AIs should prioritize validation.

---

# 13. CURRENT TECHNICAL DEBT & RISK AREAS

## Honest Assessment

ShadowSmile has progressed beyond prototype stage.

However:

The app is still in a period where:

> unknown edge cases likely exist.

This is normal for a Functional Alpha.

The goal is not perfection.

The goal is:

> identify problems before scale amplifies them.

---

## Current Risk Areas

### Verification Gaps

Many systems appear implemented but are not fully validated.

Examples:

- messaging
- search behavior
- private account edge cases
- reset-password reliability
- follow/unfollow edge cases
- reactions consistency
- comment edge cases

Current doctrine:

> implemented ≠ verified.

---

### Permission Complexity

Private accounts increase system complexity.

Private account logic touches:

- profiles
- feed visibility
- followers
- posts
- search
- messaging
- reactions
- comments

Risk:

One weak permission check can bypass trust.

Future AIs must treat privacy systems carefully.

---

### Authentication Risk

Auth systems often appear functional while hiding problems.

Future AIs should inspect:

- redirect behavior
- session refresh
- stale auth state
- protected routes
- reset-password reliability
- account switching behavior

Never assume auth is stable.

Verify it.

---

### Architecture Drift

Risk:

Fast feature building can slowly create:

- duplicated logic
- giant page files
- inconsistent data fetching
- mixed responsibilities
- difficult debugging

Current doctrine:

> modular growth over chaos.

---

### Unknown Mobile UX Issues

ShadowSmile is effectively mobile-first.

Risk areas:

- navigation spacing
- scrolling behavior
- text overflow
- image layouts
- touch interactions
- keyboard overlap
- smaller devices

Future AIs should aggressively test mobile UX.

---

### Missing Production Stress Testing

Current unknowns:

- concurrent users
- query load
- performance bottlenecks
- feed scaling
- image scaling
- database load

This is acceptable for current stage.

But must be addressed before public scale.

---

# 14. CURRENT DEVELOPMENT PRIORITIES

## Priority Order

ShadowSmile is no longer at:

> “just build everything.”

Current stage requires discipline.

Priority order:

### Priority 1 — Verification
Confirm what truly works.

Test:

- auth
- posting
- comments
- reactions
- following
- private accounts
- search
- messages
- reset-password

Goal:

> remove false assumptions.

---

### Priority 2 — Bug Hunting
Find hidden failures.

Especially:

- auth edge cases
- private profile bypasses
- broken permissions
- null crashes
- loading failures
- inconsistent state

Goal:

> trustworthy product foundation.

---

### Priority 3 — Privacy & Security
Social trust matters.

Audit:

- RLS
- permissions
- profile visibility
- follower access
- message privacy

Goal:

> users feel safe.

---

### Priority 4 — UX Consistency
Make the app feel coherent.

Questions:

- Does navigation feel intuitive?
- Does UI feel consistent?
- Does ShadowSmile feel emotionally balanced?
- Does interaction feel smooth?

Goal:

> product polish.

---

### Priority 5 — Reliability
Reduce instability.

Focus:

- loading states
- refresh behavior
- errors
- failed requests
- resilience

Goal:

> dependable app behavior.

---

### Priority 6 — New Features
Features matter.

But:

New features should not outrun reliability.

Avoid:

> unstable feature accumulation.

---

# 15. PRODUCT DIRECTION & ENGAGEMENT PHILOSOPHY

## Engagement Doctrine

ShadowSmile should aim for:

> meaningful high engagement.

The platform should feel:

- active
- socially alive
- rewarding
- emotionally real

But avoid:

- manipulative engagement loops
- outrage bait
- doomscroll addiction
- fake vulnerability farming
- attention extraction at all costs

---

## Growth Philosophy

Target:

> strong engagement without losing authenticity.

Good engagement:

- conversations
- emotional resonance
- humor
- connection
- meaningful interaction
- curiosity
- social momentum

Bad engagement:

- rage bait
- anxiety loops
- emotional exploitation
- fake perfection
- shallow virality

---

## Product Positioning

ShadowSmile should sit between:

### Thoughtful Social Media
reflection
authenticity
emotional nuance

and

### Fast Social Media
activity
social energy
retention
discoverability

Target:

> balanced middle.

The app should feel alive.

Not emotionally heavy.

Not emotionally fake.

Human.

---

# 16. DEVELOPMENT ROADMAP

## Phase 1 — Idea
✅ Complete

Product concept established.

---

## Phase 2 — Prototype
✅ Complete

Basic systems built.

---

## Phase 3 — Functional Alpha
🟢 CURRENT STAGE

Characteristics:

- multiple core systems exist
- auth exists
- social graph exists
- content exists
- messaging exists
- search exists
- private accounts exist

Main focus:

> verification + hardening.

---

## Phase 4 — Stable Beta
🔜 Next

Focus:

- bug reduction
- UX consistency
- privacy confidence
- performance improvements
- feature reliability

Success metric:

> confidence that systems consistently work.

---

## Phase 5 — Public Readiness
Future stage.

Focus:

- onboarding
- moderation
- scale readiness
- abuse prevention
- stronger analytics
- retention

Success metric:

> trustworthy public experience.

---

## Phase 6 — Scale
Long-term.

Focus:

- performance
- infrastructure
- discovery systems
- creator/community systems
- moderation sophistication

---

# 17. SHADOWSMILE DECISION FRAMEWORK

Before adding features, ask:

### Does this fit ShadowSmile identity?

### Does this improve authenticity?

### Does this hurt trust?

### Does this create technical debt?

### Does this scale?

### Does this improve emotional balance?

### Does this make the app more human?

### Does this accidentally make ShadowSmile generic?

### Does this respect privacy?

### Does this help long-term product quality?

If the answer creates conflict:

slow down.

Think deeper.

---

# 18. AI SESSION CONTINUITY RULES

Before helping ShadowSmile:

Future AIs must:

### 1. Read The Audit
Understand:

- product identity
- current stage
- verified systems
- philosophy
- technical risks

---

### 2. Verify Reality
Inspect:

- codebase
- project structure
- database schema
- runtime behavior

Do not assume.

---

### 3. Avoid Beginner Assumptions

ShadowSmile is not:

> “just starting.”

Current state:

> Functional Alpha social platform.

Advice should match current maturity.

---

### 4. Think Like A Founder

Not only:

> “How do I code this?”

Also:

- Will this scale?
- Does this feel right?
- Does this hurt trust?
- Does this create debt?
- Does this match product identity?

---

### 5. Be Sharp-Eyed

Actively inspect for:

- hidden bugs
- security risks
- weak UX
- broken logic
- inconsistency
- scalability problems

Do not be passive.

---

### 6. Protect Product Identity

Do not accidentally steer ShadowSmile into:

- generic Twitter/X
- generic Instagram
- therapy social media
- engagement addiction platform

Protect differentiation.

---

# 19. FOUNDER REMINDER

ShadowSmile is a serious long-term product.

Not:

> a toy project.

The goal is not:

> “finish coding.”

The goal is:

> build something meaningful, differentiated, trustworthy, and scalable.

Move carefully.

Build intentionally.

Protect product identity.

Think long-term.

Reality over assumptions.

Trust over shortcuts.

Quality over chaos.

---
