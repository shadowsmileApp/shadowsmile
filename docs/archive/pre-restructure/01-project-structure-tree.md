# ShadowSmile — Project Structure Tree v2
## Reality-Based Architecture Map

**Project:** ShadowSmile  
**Architecture Version:** Functional Alpha  
**Last Updated:** May 2026

---

# 1. HIGH-LEVEL ARCHITECTURE

ShadowSmile is currently built using:

## Frontend
- Next.js (App Router)
- React
- TypeScript

## Backend
- Supabase

## Deployment
- Vercel

## Tooling
- Husky Git Hooks

---

## Current Development Stage

ShadowSmile is currently in:

# Functional Alpha

Meaning:

Core systems exist and are implemented.

However:

Many systems are still:

> implemented but not fully verified.

The project has moved beyond prototype stage and is now entering:

- verification
- hardening
- UX refinement
- privacy validation
- reliability work

---

# 2. VERIFIED PROJECT STRUCTURE

Current verified structure:

```txt
shadowsmile/
├── app/
├── backup/
├── components/
├── docs/
├── lib/
├── public/
├── temp/
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.js
├── postcss.config.mjs
├── README.md
├── signup-locations.txt
├── crash.log
└── .vercel/
```

This structure is currently clean for an early-stage social platform.

---

# 3. APP DIRECTORY ARCHITECTURE

## app/

Primary application directory.

Uses:

> Next.js App Router

Current verified structure:

```txt
app/
├── api/
│   └── chat/
│       └── route.ts
│
├── components/
│   ├── BottomNav.tsx
│   └── LayoutShell.tsx
│
├── create/
│   └── page.tsx
│
├── dev/
│   └── page.tsx
│
├── messages/
│   └── page.tsx
│
├── post/
│   └── [id]/
│       └── page.tsx
│
├── profile/
│   └── [id]/
│       └── page.tsx
│
├── reset-password/
│   └── page.tsx
│
├── search/
│   └── page.tsx
│
├── signin/
│   └── page.tsx
│
├── globals.css
├── layout.tsx
├── page.tsx
└── providers.tsx
```

---

# 4. VERIFIED ROUTE MAP

## Home Feed

```txt
/
```

File:

```txt
app/page.tsx
```

Purpose:

Primary feed experience.

Expected responsibility:

- content display
- user interaction
- social engagement

Status:

> implemented, partially verified

---

## Authentication

### Sign In

```txt
/signin
```

File:

```txt
app/signin/page.tsx
```

Status:

> implemented, partially verified

---

### Reset Password

```txt
/reset-password
```

File:

```txt
app/reset-password/page.tsx
```

Status:

> implemented, insufficiently verified

---

## Content Creation

### Create Post

```txt
/create
```

File:

```txt
app/create/page.tsx
```

Purpose:

User post creation.

Verified DB support:

- content
- shadow_text
- smile_text
- image_url
- post_type

Status:

> implemented, partially verified

---

## Post System

### Dynamic Post Page

```txt
/post/[id]
```

File:

```txt
app/post/[id]/page.tsx
```

Purpose:

Single post viewing and interaction.

Expected responsibilities:

- post rendering
- comments
- reactions
- permissions

Status:

> implemented, partially verified

---

## Profile System

### Dynamic Profile Page

```txt
/profile/[id]
```

File:

```txt
app/profile/[id]/page.tsx
```

Purpose:

User identity layer.

Expected responsibilities:

- profile display
- posts
- followers
- private account logic
- profile permissions

Status:

> implemented, partially verified

---

## Discovery

### Search

```txt
/search
```

File:

```txt
app/search/page.tsx
```

Purpose:

User/content discovery.

Status:

> implemented, insufficiently verified

---

## Messaging

### Messages

```txt
/messages
```

File:

```txt
app/messages/page.tsx
```

Purpose:

Messaging experience.

Status:

> implemented, insufficiently verified

End-to-end reliability not yet confirmed.

---

## Development / Testing

### Dev Route

```txt
/dev
```

File:

```txt
app/dev/page.tsx
```

Purpose:

Developer testing and experimentation.

Status:

> internal development utility

---

## API

### Chat Route

```txt
/api/chat
```

File:

```txt
app/api/chat/route.ts
```

Purpose:

Backend chat logic.

Status:

> exists, requires runtime verification

---

# 5. COMPONENT ARCHITECTURE

## app/components/

### BottomNav.tsx

Purpose:

Primary navigation system.

Expected responsibilities:

- mobile navigation
- fast route access
- platform flow consistency

Importance:

High.

Navigation consistency strongly affects UX quality.

---

### LayoutShell.tsx

Purpose:

Global application shell.

Expected responsibilities:

- consistent layout
- route wrapping
- shared structure

Importance:

High.

Central architectural component.

---

## components/

### Navbar.tsx

Purpose:

Shared navigation component.

Current role should remain clear to avoid duplication with BottomNav.

Future AIs should watch for:

> navigation overlap and inconsistent UX.

---

# 6. SUPABASE ARCHITECTURE

## lib/

Current verified structure:

```txt
lib/
├── supabase.ts
└── supabase-server.ts
```

---

### supabase.ts

Purpose:

Client-side Supabase usage.

Likely responsibilities:

- authenticated client access
- frontend interactions
- user session handling

---

### supabase-server.ts

Purpose:

Server-side Supabase logic.

Importance:

Critical for:

- auth
- protected logic
- secure server operations

Future development should preserve:

> server/client separation discipline.

Avoid mixing responsibilities carelessly.

---

# 7. VERIFIED DATABASE RELATIONSHIPS

Current verified public tables:

```txt
profiles
posts
comments
followers
reactions
```

---

## profiles

Stores:

- identity
- handle
- display name
- avatar
- bio
- privacy state
- role system

Important verified column:

```txt
is_private
```

Private account integrity is high priority.

---

## posts

Stores:

- content
- emotional dual posting
- images
- post state

Verified differentiation:

```txt
shadow_text
smile_text
post_type
```

ShadowSmile identity already exists at DB level.

---

## comments

Purpose:

discussion and engagement layer.

---

## followers

Purpose:

social graph.

Handles:

- following
- followers
- privacy relationships

---

## reactions

Purpose:

engagement system.

---

# 8. DOCUMENTATION SYSTEM

## docs/

Current verified structure:

```txt
docs/
├── 00-shadow-smile-master-audit.md
├── 01-project-structure-tree.md
├── 02-file-inventory-find.md
├── 03-directory-dump-ls.md
└── backups/
```

Purpose:

> persistent project memory.

Future AIs should consult docs before making assumptions.

---

## docs/backups/

Current backup strategy exists.

Examples:

- route backups
- page backups
- auth-flow backups
- component backups

This is good practice for risky changes.

However:

Future cleanup may be needed to avoid backup sprawl.

---

# 9. TEMPORARY UTILITIES

## temp/

Current verified script:

```txt
temp/set-admin.js
```

Purpose:

temporary utility tooling.

Rule:

temporary scripts should eventually become:

- documented
or
- removed

Avoid hidden dependencies.

---

# 10. ARCHITECTURAL STRENGTHS

Current strengths:

### Clean early-stage structure
Good separation.

---

### App Router organization
Modern routing approach.

---

### Supabase separation
Client/server split exists.

---

### Social graph foundation exists
Followers, profiles, reactions, comments.

---

### Product differentiation exists
Shadow + Smile structure already built into database.

This is significant.

---

### Private account groundwork exists
Trust system foundation already present.

---

# 11. CURRENT TECHNICAL DEBT OBSERVATIONS

Known risks:

### Unverified systems
Messaging, search, reset-password, edge cases.

---

### Private-account complexity
Permissions will become increasingly important.

---

### Navigation overlap risk
BottomNav + Navbar may eventually create UX inconsistency.

---

### Backup accumulation
May eventually need cleanup system.

---

### Route growth risk
As features expand:

avoid giant page files.

Prefer modularization.

---

# 12. AI ORIENTATION NOTES

Before helping ShadowSmile:

Future AIs should:

1. Read the master audit
2. Understand route architecture
3. Verify database reality
4. Respect ShadowSmile identity
5. Avoid hallucinating missing systems
6. Treat implemented systems as partially verified unless proven otherwise

Current maturity:

> Functional Alpha social platform.

Not beginner stage.

Advice should match project maturity.

---
