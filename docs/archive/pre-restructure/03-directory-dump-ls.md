# ShadowSmile — Directory Dump v2
## Annotated Recursive Structure Snapshot

**Project:** ShadowSmile  
**Current Stage:** Functional Alpha  
**Last Updated:** May 2026

---

# 1. PURPOSE OF THIS FILE

This document acts as:

> a fast structural verification map.

It exists to help future AIs:

- quickly understand folder organization
- verify project structure
- detect architecture changes
- reduce hallucinated assumptions
- compare historical project states

Unlike a raw:

```bash
ls -R
```

This file is:

> intentionally organized and readable.

Always verify against live codebase when making important decisions.

Reality > documentation.

---

# 2. CURRENT VERIFIED DIRECTORY SNAPSHOT

```txt
shadowsmile/
├── app/
├── backup/
├── components/
├── docs/
├── lib/
├── public/
├── temp/
├── .husky/
├── .vercel/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.js
├── next-env.d.ts
├── postcss.config.mjs
│
├── README.md
├── crash.log
├── signup-locations.txt
│
├── .env.local
├── .env.local.save
├── .env.example
├── .gitignore
├── .secretlintrc.json
│
├── full-find.txt
├── full-find-clean.txt
├── full-ls.txt
└── full-ls-clean.txt
```

---

# 3. APP ROUTE TREE

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

Verified routes:

```txt
/
/signin
/create
/post/[id]
/profile/[id]
/search
/messages
/reset-password
/dev
/api/chat
```

Status:

> implemented, partially verified

---

# 4. COMPONENT STRUCTURE

## App Components

```txt
app/components/
├── BottomNav.tsx
└── LayoutShell.tsx
```

Responsibilities:

### BottomNav.tsx
Navigation system.

### LayoutShell.tsx
Shared application shell.

---

## Shared Components

```txt
components/
└── Navbar.tsx
```

Future AIs should watch for:

> navigation overlap between Navbar and BottomNav.

---

# 5. DATABASE / LIBRARY STRUCTURE

```txt
lib/
├── supabase-server.ts
└── supabase.ts
```

Purpose:

Supabase integration layer.

Architecture expectation:

```txt
client ↔ supabase.ts
server ↔ supabase-server.ts
```

Future AIs should preserve:

> clean responsibility boundaries.

---

# 6. DOCUMENTATION STRUCTURE

```txt
docs/
├── 00-shadow-smile-master-audit.md
├── 01-project-structure-tree.md
├── 02-file-inventory-find.md
├── 03-directory-dump-ls.md
└── backups/
```

Purpose:

Persistent project memory.

These docs collectively form:

> ShadowSmile AI continuity system.

Importance:

> extremely high

Future AIs should read before advising.

---

# 7. BACKUP STRUCTURE

```txt
docs/backups/
├── BottomNav.tsx.backup
├── page.backup.tsx
├── page.tsx.backup
├── page.tsx.backup.authflow
├── page.tsx.save
├── page.tsx.save.1
├── page.tsx.save.2
└── route.ts.save
```

Purpose:

Rollback protection.

Current recommendation:

> keep during Functional Alpha.

Cleanup can happen later.

Avoid deleting potentially useful recovery points.

---

# 8. TEMPORARY UTILITIES

```txt
temp/
└── set-admin.js
```

Purpose:

Temporary administrative tooling.

Rule:

Temporary files should eventually become:

- documented
or
- removed

Avoid hidden dependencies.

---

# 9. GENERATED AI CONTEXT FILES

```txt
full-find.txt
full-find-clean.txt
full-ls.txt
full-ls-clean.txt
```

Purpose:

Architecture snapshots.

Useful for:

- fast AI onboarding
- historical comparison
- debugging
- project verification

Status:

> regeneratable artifacts

Recommended regeneration after:

- route changes
- folder restructuring
- feature expansion
- architecture changes

---

# 10. ENVIRONMENT & SECURITY FILES

```txt
.env.local
.env.local.save
.env.example
.secretlintrc.json
.gitignore
```

Importance:

> critical

Future AIs must:

Never expose secrets.

Never commit:

```txt
.env.local
```

Respect environment separation.

---

# 11. PROJECT HEALTH SNAPSHOT

## Strengths
✅ clean early-stage architecture  
✅ route organization  
✅ documentation system  
✅ Supabase separation  
✅ backup discipline  
✅ product differentiation already implemented

---

## Watch Areas
⚠ messaging verification  
⚠ private-account edge cases  
⚠ auth edge cases  
⚠ search reliability  
⚠ route growth complexity  
⚠ backup accumulation

---

# 12. AI INTERPRETATION RULES

Future AIs should use this document to:

### understand structure quickly

not:

### blindly trust architecture assumptions.

Always:

1. verify code
2. inspect runtime behavior
3. confirm database reality

Treat this document as:

> a structural snapshot.

Not guaranteed truth.

Current maturity:

> Functional Alpha social platform.

Not beginner stage.

Reality > assumptions.

---
