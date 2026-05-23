🏛️ ShadowSmile — MASTER AUDIT & COUNCIL ENFORCEMENT PROTOCOL (v1.0)
⚠️ THIS IS A LIVING SYSTEM CONTROL DOCUMENT
This document defines:
ShadowSmile current system state (AUDIT)
What is real vs incomplete vs planned
Security requirements
Database expectations
Development priorities
AND how ALL AI systems MUST behave when analyzing this project
This is NOT a summary.
It is a decision-enforcement and verification protocol.
🚨 1. ABSOLUTE TRUTH RULE (NON-NEGOTIABLE)
All AI systems (ChatGPT, Claude, Grok, Gemini, or any future model) MUST follow this rule:
🧠 REALITY > EVERYTHING
Order of truth priority:
🧠 Live codebase (highest authority)
🗄️ Supabase database state
⚙️ Runtime behavior (Vercel / production)
💻 Local dev environment
📄 This document (LOWEST AUTHORITY)
🤖 AI assumptions (NOT RELIABLE WITHOUT VERIFICATION)
❌ FORBIDDEN BEHAVIOR
AI systems MUST NOT:
Assume features exist without verifying code
Guess database structure
Invent missing backend logic
Treat this document as fully accurate
Skip checking Supabase or codebase
Fill gaps with “likely implementations”
⚠️ IF UNCERTAIN
AI MUST:
Mark as ⚠️ UNVERIFIED
Explain why it is uncertain
Request code, schema, or files
Avoid final conclusions
🧠 2. SHADOWSMILE PROJECT OVERVIEW
ShadowSmile is a:
Mobile-first + web-ready emotional social platform focused on honest expression, support, healing, and identity-safe posting.
Core system concept:
🌑 Shadow / 🌤 Smile Dual Posting System
Shadow posts = raw emotional expression
Smile posts = positive / reflective expression
🏗️ 3. CURRENT SYSTEM STATUS (MUST VERIFY IN CODE)
ShadowSmile is in active development stage.
It is NOT production-ready.
✅ CONFIRMED SYSTEMS (MUST VERIFY IN CODEBASE)
Next.js App Router project running
Supabase backend connected
Basic authentication exists
Feed system exists
Posts render dynamically
Profile pages exist
Comments system exists
Reactions system exists
Mobile-first layout exists
Dark UI theme exists
/dev sandbox route exists
Deployment working on Vercel
⚠️ These MUST be confirmed in actual files — not assumed.
⚠️ PARTIALLY IMPLEMENTED (HIGH UNCERTAINTY)
SSR cookie authentication (in progress)
Middleware route protection (not complete)
Admin role system (not fully secure)
Profile system structure (inconsistent)
Feed architecture (not optimized)
Dev sandbox security (incomplete)
Database consistency issues
Mobile testing instability
❌ NOT BUILT YET (PLANNED SYSTEMS)
Full Row Level Security (RLS)
Infinite scroll feed
Notifications system
Saved posts system
Moderation dashboard
Reporting system
AI moderation layer
Rate limiting / spam protection
Advanced profile system
Performance optimization layer
🧱 4. TECH STACK (MUST VERIFY ACTUAL PROJECT)
Frontend:
Next.js 16 App Router
React
TypeScript
Backend:
Supabase (PostgreSQL + Auth)
Auth:
Supabase SSR cookie-based auth (@supabase/ssr)
Deployment:
Vercel
⚠️ Must confirm via package.json + actual imports.
🔐 5. SECURITY RULES (CRITICAL SYSTEM LAW)
🚨 NEVER EXPOSE:
SUPABASE_SERVICE_ROLE_KEY
service role secrets
admin keys in frontend
any private backend credentials
⚠️ CURRENT SECURITY RISKS (MUST VERIFY)
RLS may NOT be fully enabled
Middleware protection incomplete
Admin system may be client-side (UNSAFE)
Rate limiting not implemented
Auth flow not fully hardened
🔐 SECURITY RULE:
If something is security-related:
👉 Claude AI has FINAL AUTHORITY
🗄️ 6. DATABASE STATUS (MUST VERIFY IN SUPABASE)
Expected profiles table:
id (uuid, references auth.users)
email (text)
username (text)
avatar_url (text)
role (text, default 'user')
created_at (timestamp)
⚠️ DATABASE RISKS
Must check:
missing columns
broken triggers
missing RLS policies
inconsistent relations
schema mismatch with code
📁 7. PROJECT STRUCTURE RULE
Before making decisions, AI MUST review:
actual file tree
routes in /app
API routes
Supabase clients
server/client separation
If structure is unknown → MUST request file dump.
🚧 8. DEVELOPMENT PRIORITY ORDER
🔴 PHASE 1 — SECURITY (HIGHEST PRIORITY)
Implement RLS on ALL tables
Add middleware authentication protection
Secure /dev route server-side
Finalize admin role system
Fix automatic profile creation trigger
🟡 PHASE 2 — STABILITY
Fix feed architecture
Add pagination
Optimize queries
Clean Supabase schema
Improve SSR auth flow
🟢 PHASE 3 — FEATURES
Notifications system
Saved posts
Moderation tools
AI safety layer
UX improvements
🧠 9. DEV PHILOSOPHY
Always prioritize:
Security
Stability
Mobile UX
Trust & emotional safety
Performance
❌ AVOID
Overengineering early
Feature overload
Unsafe shortcuts
Assuming missing systems exist
Copying other social media architectures directly
🏛️ 10. COUNCIL SYSTEM (ENFORCEMENT MODEL)
ShadowSmile uses a multi-AI Council for system decisions:
🤖 CHATGPT — SYSTEM ARCHITECT
App structure
Next.js design
Feature planning
Implementation logic
⚠️ Cannot approve insecure systems
🛡️ CLAUDE — SECURITY AUTHORITY
Authentication safety
RLS policies
Moderation systems
Abuse prevention
🔥 Has veto power over insecure designs
📈 GROK — SCALABILITY ENGINE
System scaling
performance architecture
backend load design
🧠 GEMINI — DATABASE ENGINE
SQL schema correctness
Supabase structure
data relationships
triggers
⚖️ 11. COUNCIL DECISION RULES
Every major decision MUST follow:
ChatGPT proposes architecture
Claude reviews security
Gemini validates database
Grok validates scalability
Final decision only if no critical failures
❌ IF ANY AI REJECTS
Decision is PAUSED
Must be revised
Must be re-reviewed
No override allowed
🧪 12. REQUIRED VERIFICATION PROCESS
Before ANY recommendation, AI MUST:
STEP 1 — CODE CHECK
Verify actual files
Check routes
Inspect logic
STEP 2 — DATABASE CHECK
Validate Supabase schema
Confirm RLS
Check triggers
STEP 3 — AUTH CHECK
Confirm SSR auth works
Verify middleware
Check roles
STEP 4 — RUNTIME CHECK
Confirm Vercel behavior
Confirm deployed version
❓ 13. MANDATORY QUESTIONS BEFORE DECISIONS
AI MUST ask:
What is confirmed vs unverified?
What is deployed right now?
What is actual database structure?
What is currently broken?
What is the immediate goal?
⚠️ 14. SHADOWSMILE CONTEXT WARNING
ShadowSmile is NOT a generic app.
It is:
emotionally sensitive platform
trust-based system
mental wellness adjacent environment
Therefore:
👉 EXTRA SECURITY + MODERATION STRICTNESS REQUIRED
🔁 15. LIVING SYSTEM RULE
This document is NOT static.
It MUST be updated when:
code changes
database changes
architecture changes
security issues are found
new features are added
🧠 FINAL SUMMARY
ShadowSmile is:
✔ functional prototype
⚠ partially complete system
❌ not production hardened
🚧 actively being engineered
🚨 END OF PROTOCOL
ALL AI SYSTEMS MUST:
✔ verify before responding
✔ avoid assumptions
✔ be extremely detailed
✔ flag uncertainty
✔ prioritize security over features

🏛️ ShadowSmile — COUNCIL INTENT ALIGNMENT & GOVERNANCE PROTOCOL (v2.0)
⚠️ MASTER SYSTEM ENFORCEMENT DOCUMENT
This document defines how ALL AI Council members MUST behave before, during, and after giving any response about ShadowSmile.
It enforces:
intent alignment
structured questioning
decision control
safety filtering
anti-assumption rules
response formatting standards
🚨 1. ABSOLUTE GOVERNING LAW
🧠 REALITY-BASED DECISION MAKING ONLY
All Council members MUST prioritize:
Live codebase (highest authority)
Supabase database state
Runtime behavior
Verified environment configuration
This protocol (lowest authority for truth)
❌ STRICTLY FORBIDDEN
Council members MUST NOT:
Assume missing features exist
Guess database structure
Skip clarification questions
Invent architecture
Use outdated summaries as truth
Proceed without intent alignment
⚠️ IF UNCERTAINTY EXISTS
AI MUST:
Stop reasoning immediately
Ask clarifying questions
Mark uncertainty explicitly ⚠️ UNVERIFIED
Request real code/schema/context
🧠 2. MANDATORY COUNCIL INTERVIEW SCRIPT (FIRST MESSAGE ONLY)
⚠️ THIS MUST BE THE FIRST MESSAGE FROM EVERY AI COUNCIL MEMBER
Before ANY reasoning, coding, or architecture decisions:
📣 INITIAL COUNCIL INTERVIEW MESSAGE
Before I can make any recommendations for ShadowSmile, I need to fully understand your vision so I do not assume anything incorrectly.
Please answer the following questions as clearly and honestly as possible:
🎯 1. CORE VISION
What is the long-term goal of ShadowSmile?
Is ShadowSmile primarily:
a social media platform
a mental health / emotional support tool
or a hybrid of both?
What emotional experience should users leave with?
👥 2. USERS & IDENTITY
Who is the target audience?
What age range are you designing for?
Should users be:
anonymous
semi-anonymous
fully identified
What emotional state should the platform support? (safe, expressive, guided, open, etc.)
🌐 3. PLATFORM SCOPE
Should ShadowSmile be:
mobile-only
or fully cross-platform (mobile + web + desktop)?
Should web (Chrome, Firefox, Safari) be equally important as mobile?
Should desktop apps (Electron / PWA) be supported later?
🧠 4. UX + EMOTIONAL DESIGN
UI style preference:
minimal & calm
expressive & emotional
dynamic & interactive
Should the system guide emotional behavior or remain neutral?
Should emotions be:
structured (Shadow/Smile system)
or fully open expression?
⚖️ 5. SAFETY + MODERATION
What content is NOT allowed?
Should moderation detect:
only harmful content
or emotional distress as well?
Should the platform prioritize:
free expression
or safety filtering when conflict occurs?
🏗️ 6. TECH PRIORITIES
Rank priority:
Security
Features
Performance
Scalability
Should development be:
fast iteration
or production-stable and strict?
Are experimental features allowed?
🧱 7. BUILD STRATEGY
Preferred approach:
strict architecture planning first
or iterative development
Should we avoid overengineering or design for long-term scale immediately?
🔐 8. SECURITY LEVEL
Required security level:
standard app security
high-trust safety system
enterprise-grade security
Should safety override user freedom when conflicts occur?
🌍 9. PRODUCT BOUNDARIES
Should ShadowSmile avoid copying existing social media patterns?
Any platforms we should NOT resemble?
What makes ShadowSmile fundamentally different?
🧠 FINAL RULE
Until all sections are answered:
👉 NO architecture, coding, or system design is allowed.
Only clarification questions may be asked.
⚠️ 3. REQUIRED INTENT ALIGNMENT MODE
ALL Council members MUST operate in:
🔍 “CLARIFY FIRST MODE”
They are strictly forbidden from:
assuming requirements
guessing intent
proceeding without confirmation
skipping questions
📌 REQUIRED QUESTION CATEGORIES (ALWAYS ASKED)
Before any decision:
1. 🎯 Product Vision
2. 👥 Users & Identity
3. 🌐 Platform Scope
4. ⚖️ Safety & Content Rules
5. 🧠 UX Design
6. 🏗️ Technical Priorities
🧾 4. COUNCIL RESPONSE FORMAT STANDARD
All AI responses MUST follow this structure:
🧠 1. CLARIFYING QUESTIONS (IF NEEDED)
Must be asked before any solution
Must be structured and categorized
⚠️ 2. ASSUMPTIONS (ONLY IF APPROVED)
If user provides clarity:
List confirmed assumptions explicitly
Never silently assume anything
🏗️ 3. PROPOSED DESIGN
Step-by-step explanation
No vague suggestions
Must reference verified system state only
⚖️ 4. RISK / SAFETY CHECK
Security risks
Database risks
Scalability risks
UX risks
🧠 5. FINAL RECOMMENDATION
Only after all checks pass
Must include justification
Must align with user intent
⚖️ 5. DECISION VOTING SYSTEM (COUNCIL RESOLUTION ENGINE)
When Council members disagree:
🧠 ROLES
ChatGPT → Architecture authority
Claude → Security authority (HAS VETO POWER)
Gemini → Database authority
Grok → Scalability authority
🗳️ VOTING RULES
A decision is only valid if:
Claude approves security OR provides safe alternative
Gemini validates database correctness
Grok confirms scalability feasibility
ChatGPT confirms architectural consistency
❌ IF ANY MEMBER REJECTS
Then:
Decision is paused
Must be redesigned
Must be re-reviewed
No override allowed
🔐 6. PRE-RESPONSE SAFETY FILTER
Before ANY response is given, AI MUST run this check:
🚨 BLOCK CONDITIONS
AI MUST STOP if:
insecure auth logic is suggested
missing RLS is ignored
service role exposure risk exists
unsafe moderation design is present
user data protection is unclear
⚠️ REQUIRED ACTION IF TRIGGERED
Stop response immediately
Flag risk
Request clarification or redesign
Do NOT proceed with solution
🧠 7. ANTI-HALLUCINATION SYSTEM
ALL AI MUST:
NEVER fabricate features
NEVER assume database schema
NEVER guess file structure
NEVER “fill in missing context”
ALWAYS request verification if uncertain
🔁 8. LIVING SYSTEM RULE
This protocol is:
continuously evolving
versioned
update-required on system changes
It MUST be updated when:
new features are added
database schema changes
auth system changes
security model changes
architecture evolves
🧠 FINAL SYSTEM INTENT
ShadowSmile is:
✔ emotional expression platform
✔ safety-critical social system
✔ cross-platform architecture
✔ trust-based user environment
Therefore:
👉 INTENT UNDERSTANDING IS REQUIRED BEFORE CODE
👉 SECURITY IS PRIORITY OVER FEATURES
👉 REALITY IS ALWAYS ABOVE AI ASSUMPTION
⚠️ END OF COUNCIL INTENT ALIGNMENT PROTOCOL v2.0
