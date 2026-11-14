# Developer Growth Hub

## 1. Set up Supabase (about 10 minutes, free tier is fine)
1. Create a project at supabase.com.
2. SQL Editor, New query: paste `supabase/schema.sql`, Run.
3. Project Settings, API: copy the **Project URL** and the **anon public** key.
4. Authentication, URL Configuration: set **Site URL** to your Vercel URL (add `http://localhost:5173` under Redirect URLs for local testing).
5. Optional: Authentication, Providers, Email: turn off "Confirm email" if you want members in instantly.

## 2. Run locally
    cp .env.example .env     # paste the two Supabase values
    npm install
    npm run dev

Without the `.env` values the app still runs in local demo mode (data stays in the browser).

## 3. Deploy to Vercel
1. Push this folder to GitHub, then Vercel: Add New, Project, import it.
2. Settings, Environment Variables: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy.

## 3b. Deploy the separate Admin site
Same repo, second Vercel project (Add New, Project, import the same repo again). Add the two Supabase variables **plus**
`VITE_APP_MODE=admin` (optionally `VITE_MEMBER_SITE_URL`). Give it its own domain, e.g. admin.yourcommunity.com.
- The admin site only lets team leads in, has a teal look, and has no sign-up.
- The member site has no admin screens or switch at all.
- Add both URLs in Supabase, Authentication, URL Configuration (Redirect URLs).
- Real security is still the database rules in schema.sql, not the website.

## 4. Make yourself admin
Sign up on the live site, then run in the SQL Editor:
    update public.profiles set role = 'admin' where email = 'you@example.com';
Sign out and back in. You will now see the Admin switch. Roles are enforced by the database, not the browser.

## How data is stored
- `member_state`: each member's private progress (courses, quizzes, logs, profile). Only they and admins can read it.
- `shared_state`: community data (posts, help requests, challenges, projects...), updated live for everyone.
  Quizzes, schedule, events and resources can only be changed by admins.
- Sharing is last-write-wins per section, which is fine for a small community. If two people post at the exact same moment, one post can be lost.
