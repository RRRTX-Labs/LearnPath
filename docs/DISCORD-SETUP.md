# Discord Setup — Server, OAuth Login, and (Later) a Bot

Three different things, often confused. LearnPath uses **#2 today**. **#1** is a community
space you create manually. **#3** does not exist yet and must not be built until its
architecture and permissions are written down and approved.

| # | Thing | What it is | Status |
|---|---|---|---|
| 1 | **Discord server** | A community space (channels, roles, moderation) | Create manually — guide below |
| 2 | **Discord OAuth login** | "Continue with Discord" on the sign-in page (authorization-code grant, scope `identify`) | ✅ Implemented (Better Auth) |
| 3 | **Discord bot** | An automated account that can post, moderate, or sync roles via the API | ❌ Not built. Design first. |

OAuth login does **not** add users to your server, read messages, or require a bot token.
A bot does **not** log users in. A server does **not** authenticate anyone.

---

## Part 1 — Create the official LearnPath server (step by step)

1. **Account**: discord.com → register/log in → enable 2FA on the owner account
   (required later for Community features and moderator safety).
2. **Create server**: left sidebar **＋** → *Create My Own* → *For a club or community* →
   name: **LearnPath** → upload the brand mark as the icon
   (`branding/mark-light-512.png` in this repo — 512×512 PNG, already square).
3. **Server settings → Overview**: description ("Free, structured learning paths…"),
   set the same icon, disable the DM-from-everyone default for new members if desired.
4. **Categories & channels** (create in this order; text = #, voice = 🔊):

   ```
   ▸ START HERE
       #welcome            (read-only; onboarding message — see below)
       #rules              (read-only)
       #announcements      (read-only; staff post)
       #introductions
   ▸ ROADMAPS
       #python-developer
       #full-stack
       #ai-engineer
       #security
       #roadmap-feedback   (suggest changes to curricula — ties into open source)
   ▸ LEARNING
       #help-me-im-stuck   (support channel)
       #study-partners     (find peers, pair sessions)
       #practice-and-challenges
   ▸ SHOWCASE
       #project-showcase   (ship posts; enable slow-mode 5m)
       #resource-finds     (community-sourced free resources → feed into curation)
   ▸ OPEN SOURCE
       #github-contribute  (issues/PRs of the LearnPath repo)
       #bug-reports
   ▸ VOICE
       🔊 Study Room 1 · 🔊 Study Room 2 · 🔊 Pair Programming
   ▸ STAFF (private)
       #mod-log  #staff-chat  🔊 Staff
   ```

5. **Roles** (Settings → Roles), top-down:
   - **Owner** (implicit) — full control, 2FA on.
   - **Maintainer** (RRRTX Labs staff) — manage channels/messages, kick, slow-mode.
   - **Moderator** — timeout, delete messages, manage messages; cannot change roles above self.
   - **Contributor** — granted to merged-PR authors (manual until automation exists).
   - **Learner** — default role for everyone who passes onboarding.
   Keep role colors restrained (brand teal/amber); avoid rainbow hierarchies.
6. **Permissions (safety defaults)**:
   - @everyone: *View Channels*, *Send Messages*, *Add Reactions*, *Read History* — **deny**
     @everyone in #welcome/#rules/#announcements (read-only via role override).
   - New-member moderation: Settings → **Safety Setup** → require verified email/phone;
     enable AutoMod presets (spam, slur/profanity, mention spam).
   - Moderation → enable **Server Guidelines** acceptance gate if available in your region.
7. **Onboarding** (Settings → Onboarding): questions = "Which roadmap are you on?"
   (answers map to roadmap channel access) and "Looking for study partners?" (→ #study-partners).
   Default channels: START HERE + LEARNING.
8. **Welcome message** (post once, pin in #welcome):

   > Welcome to LearnPath — the campus around the curriculum.
   > Pick your roadmap channel, say hi in #introductions, and post what you ship in
   > #project-showcase. Stuck? #help-me-im-stuck, no question too small.
   > LearnPath is free and open source: contributions in #github-contribute.
   > We do not do hype, streaks, or leaderboards here — capability only.

9. **Rules** (post in #rules): be kind · no cheating on challenges (help, don't hand over
   solutions) · no pirated/paid-content links · no unsolicited DMs · no crypto/finance spam ·
   moderators' calls are final · report via ModMail/DM to a Moderator.
10. **Support channel etiquette** (#help-me-im-stuck): require a code block + error text +
    what was tried; Moderators/Maintainers answer; learners may answer too (teaching counts).
11. **Security checklist**: owner + all staff on 2FA · no bot tokens in chat ever ·
    webhook URLs treated as secrets · audit log reviewed weekly · vanity/invite links
    rotated if spammed · backups: none needed (Discord holds history; pin the important bits).

Invite link: Server Settings → Invites → create with **never expire**, `?`-less clean link;
store it as `NEXT_PUBLIC_DISCORD_INVITE` in `.env.local` / Vercel so the site's Discord
buttons point at it. Do not hardcode it in components.

---

## Part 2 — Discord OAuth login (already implemented)

- Flow: standard OAuth 2.0 **authorization code grant** (current Discord docs):
  `https://discord.com/oauth2/authorize?response_type=code&client_id=…&scope=identify&redirect_uri=…`
  → user approves → code → server exchanges for tokens (`grant_type=authorization_code`).
- Register redirect: `http://localhost:3000/api/auth/callback/discord` and
  `https://<prod-domain>/api/auth/callback/discord` (exact strings; see `docs/AUTH-SETUP.md`).
- Env: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`. The sign-in button appears only when set.
- What login gives LearnPath: Discord user id, username, avatar, email (if scope added).
  Nothing else. It does **not** join the user to your server.

---

## Part 3 — A bot: design gates before any code

Do not create a production bot until these are answered in a design doc + PR review:

1. **Purpose** (pick the smallest useful set): e.g. post roadmap/challenge announcements;
   optionally grant a **Contributor** role on merged PR (GitHub webhook → role grant).
2. **Minimum scopes/permissions**: `bot` + `applications.commands`; guild permissions only
   `Manage Roles` (below bot's top role), `Send Messages`, `Read Message History` in chosen
   channels. Never `Administrator`.
3. **Token handling**: secret manager only (Vercel env); rotate on any leak; bot reads it
   server-side — never ships to the browser.
4. **Rate limits & failures**: Discord returns 429 with `retry_after`; every action must
   respect it; queue, don't hammer.
5. **Privacy**: no message content harvesting; log only ids/timestamps needed for the feature.
6. **Verification**: if public, pass Discord app verification before wide release; keep it
   private (server-only) until then.

Until then: zero bots, zero risk, fully functional community + login.
