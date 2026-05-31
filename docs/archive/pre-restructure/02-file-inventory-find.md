# ShadowSmile — File Inventory v2
## Intelligent File Inventory + AI Orientation Map

**Project:** ShadowSmile  
**Current Stage:** Functional Alpha  
**Last Updated:** May 2026

---

# 1. PURPOSE OF THIS FILE

This document replaces a raw `find . -maxdepth 6` dump with a structured inventory.

Purpose:

- help future AIs quickly understand project reality
- reduce hallucinated architecture assumptions
- speed onboarding
- document critical systems
- identify important files
- preserve project memory

This file reflects:

> verified project structure at time of generation.

Future AIs should treat this document as:

> architectural context

not permanent truth.

Always verify against the actual codebase.

---

# 2. CORE APPLICATION FILES

## Root Application Files

```txt
package.json
package-lock.json
tsconfig.json
next.config.js
postcss.config.mjs
next-env.d.ts
README.md
```

Purpose:

Core framework, dependency, and TypeScript configuration.

Importance:

> critical

---

## App Shell

```txt
app/layout.tsx
app/providers.tsx
app/globals.css
app/page.tsx
```

Purpose:

Global application structure.

Responsibilities likely include:

- app shell
- provider wrapping
- styling
- root route behavior
- feed experience

Importance:

> extremely high

Changes here affect most of the app.

---

# 3. ROUTE INVENTORY

## Authentication

```txt
app/signin/page.tsx
app/reset-password/page.tsx
```

Purpose:

- sign in
- auth flow
- password reset

Status:

> implemented, partially verified

---

## Content Creation

```txt
app/create/page.tsx
```

Purpose:

Post creation flow.

Verified database support:

```txt
content
shadow_text
smile_text
post_type
image_url
```

Importance:

> core platform feature

---

## Post System

```txt
app/post/[id]/page.tsx
```

Purpose:

Single-post experience.

Expected responsibilities:

- post rendering
- comments
- reactions
- permissions

Importance:

> core platform feature

---

## Profile System

```txt
app/profile/[id]/page.tsx
```

Purpose:

Identity layer.

Expected responsibilities:

- profile rendering
- user posts
- followers
- private-account logic
- visibility permissions

Important verified column:

```txt
profiles.is_private
```

Importance:

> extremely high

Trust-critical system.

---

## Search

```txt
app/search/page.tsx
```

Purpose:

Discovery.

Status:

> implemented, insufficiently verified

---

## Messaging

```txt
app/messages/page.tsx
```

Purpose:

Messaging experience.

Status:

> implemented, insufficiently verified

Requires runtime testing.

---

## Development Utilities

```txt
app/dev/page.tsx
```

Purpose:

Internal testing.

Should remain:

> development only

---

# 4. API LAYER

## Chat Route

```txt
app/api/chat/route.ts
```

Purpose:

Backend chat functionality.

Status:

> exists, runtime verification required

Future AIs should inspect:

- auth
- permissions
- persistence
- failure states

---

# 5. COMPONENT INVENTORY

## Application Components

```txt
app/components/
├── BottomNav.tsx
└── LayoutShell.tsx
```

### BottomNav.tsx

Purpose:

Navigation system.

Expected role:

- mobile-first navigation
- fast app movement
- route consistency

Importance:

> high

---

### LayoutShell.tsx

Purpose:

Shared layout architecture.

Importance:

> critical

Future AIs should inspect carefully before modifying.

---

## Shared Components

```txt
components/
└── Navbar.tsx
```

Purpose:

Navigation UI.

Potential future concern:

Avoid overlapping UX responsibility with:

```txt
BottomNav.tsx
```

---

# 6. DATABASE / SUPABASE FILES

```txt
lib/
├── supabase.ts
└── supabase-server.ts
```

---

## supabase.ts

Purpose:

Client-side Supabase interactions.

Likely responsibilities:

- authenticated requests
- frontend database interaction
- session access

Importance:

> high

---

## supabase-server.ts

Purpose:

Server-side Supabase logic.

Importance:

> extremely high

Future AIs should protect:

> server/client separation

Avoid accidental auth exposure.

---

# 7. VERIFIED DATABASE SYSTEMS

Current verified tables:

```txt
profiles
posts
comments
followers
reactions
```

---

## Profiles

Verified columns include:

```txt
id
handle
avatar_url
created_at
email
role
display_name
bio
is_private
```

Importance:

> extremely high

Identity + privacy system.

---

## Posts

Verified columns include:

```txt
content
shadow_text
smile_text
post_type
status
image_url
```

Importance:

> platform differentiation

ShadowSmile identity already exists at database level.

---

## Followers

Purpose:

Social graph.

Importance:

> trust system

---

## Comments

Purpose:

Engagement and discussion.

---

## Reactions

Purpose:

Social interaction layer.

---

# 8. DOCUMENTATION SYSTEM

## Core Docs

```txt
docs/
├── 00-shadow-smile-master-audit.md
├── 01-project-structure-tree.md
├── 02-file-inventory-find.md
├── 03-directory-dump-ls.md
```

Purpose:

Persistent AI context.

These files form:

> ShadowSmile project memory.

Importance:

> extremely high

Future AIs should read these before advising.

---

## Backup Documentation

```txt
docs/backups/
```

Verified backups:

```txt
BottomNav.tsx.backup
page.backup.tsx
page.tsx.backup
page.tsx.backup.authflow
page.tsx.save
page.tsx.save.1
page.tsx.save.2
route.ts.save
```

Purpose:

Safe rollback points.

Status:

> useful during Functional Alpha

Avoid deletion until app stabilizes.

---

# 9. AI CONTEXT FILES

Generated project snapshots:

```txt
full-find.txt
full-find-clean.txt
full-ls.txt
full-ls-clean.txt
```

Purpose:

Rapid architecture inspection.

Helps future AIs:

- understand structure quickly
- inspect project evolution
- verify file organization

These files are:

> regeneratable artifacts

Meaning:

Helpful but can become stale.

Regenerate after:

- route additions
- major refactors
- architecture shifts
- new systems

Suggested regeneration:

```bash
find . -maxdepth 6
ls -R
```

with exclusions.

---

# 10. TEMPORARY UTILITIES

```txt
temp/
└── set-admin.js
```

Purpose:

Administrative tooling.

Rule:

Temporary scripts should eventually become:

- documented
or
- removed

Avoid hidden infrastructure dependencies.

---

# 11. ENVIRONMENT & CONFIGURATION

Verified files:

```txt
.env.local
.env.example
.env.local.save
.secretlintrc.json
.gitignore
```

Importance:

> critical

Contains:

- environment handling
- secret protection
- project security rules

Future AIs must:

> never expose secrets.

Never commit:

```txt
.env.local
```

---

# 12. PUBLIC ASSETS

```txt
public/
└── Shadowsmile.png
```

Purpose:

Branding / UI assets.

Importance:

> medium-high

Brand identity matters.

---

# 13. LOGS & DEBUGGING

```txt
crash.log
signup-locations.txt
```

Purpose:

Potential debugging context.

Future AIs should inspect before deletion.

Do not assume irrelevant.

---

# 14. BACKUP DIRECTORY

```txt
backup/
```

Status:

Currently exists.

Purpose:

General backup safety.

Should remain organized.

Avoid hidden forgotten files.

---

# 15. CURRENT FILE HEALTH ASSESSMENT

## Strong Areas
✅ clean root structure  
✅ route organization  
✅ Supabase separation  
✅ documentation system  
✅ backup discipline

---

## Watch Areas
⚠ messaging verification  
⚠ search verification  
⚠ private-account permissions  
⚠ backup accumulation  
⚠ temp script sprawl

---

# 16. AI ORIENTATION NOTES

Before helping ShadowSmile:

Future AIs should:

1. Read `00-shadow-smile-master-audit.md`
2. Read `01-project-structure-tree.md`
3. Read this inventory
4. Verify runtime behavior
5. Verify database truth
6. Avoid hallucinating systems

Current maturity:

> Functional Alpha social platform.

Not beginner stage.

Treat implemented systems as:

> partially verified unless proven otherwise.

Reality > assumptions.

---
