# Activate player accounts and cloud saves

The game works immediately with a guest save. To activate **Gmail/email login links, Google, Facebook, and account-based cloud saves**, connect your own Supabase project. These providers are not activated in the download: an authentication project and provider credentials must belong to the website owner.

You only need to do this once for your website. Players never enter configuration keys. No game rebuild or Node.js installation is needed for the compiled website download.

## 1. Create the Supabase project and save table

1. Sign in at https://supabase.com/dashboard and create a project.
2. In that project's **SQL Editor**, create a new query. Paste the complete contents of `docs/supabase.sql` from the download and run it. The script can be run again safely.
3. Under the project's **Connect / API keys** settings, copy the **Project URL** and **publishable key**. A legacy `anon` public key also works.
4. In your extracted website folder, open `account-config.json` in a text editor and replace the empty values:

```json
{
  "supabaseUrl": "https://YOUR-PROJECT-REF.supabase.co",
  "supabasePublishableKey": "YOUR-PUBLIC-PUBLISHABLE-KEY"
}
```

Keep the quotation marks and comma. Save it as `account-config.json`, not `account-config.json.txt`. These two values are public browser configuration. **Never put a service-role key, secret key, database password, Google secret, Facebook secret, or SMTP password in this file.** The SQL rules protect each authenticated player's save.

For the source project, the corresponding file is `public/account-config.json`; Vite copies it into the website build.

## 2. Set your website address

In Supabase **Authentication → URL Configuration**:

- Set **Site URL** to your existing game's HTTPS address, for example `https://your-game.netlify.app`.
- Add that exact game's landing-page URL to **Redirect URLs**, for example `https://your-game.netlify.app/`.
- If you use a subfolder or a custom domain, also add the exact URL users open there. Do not add unrestricted wildcards.
- For local testing only, add `http://localhost:5173/` and/or `http://localhost:4173/`.

Keep this address stable. Guest saves are tied to a browser and website address; signed-in saves are tied to the player's account.

## 3. Enable Gmail / email login

1. In **Authentication → Sign In / Providers → Email**, enable email sign-in and allow new user signups if players should be able to register.
2. Configure a working **custom SMTP** sender for emails to real players. Supabase's default test mail service restricts recipients and rate limits; it is not a production email sender. Put SMTP credentials only in the Supabase dashboard.
3. Keep the standard magic-link email template, which opens the confirmation URL. The game uses a one-time email link and does not ask for or store passwords.
4. Test with a Gmail address. Click **Player account → Gmail / email login link → Send link**, then open the received link in the same browser where you requested it. Check spam if necessary.

A Gmail address can use the email-link option or the Google option below.

## 4. Enable Google account login

1. Open https://console.cloud.google.com/ and create or select your project.
2. Configure the OAuth consent screen and create an **OAuth 2.0 client ID → Web application**. Add your game's origin where required.
3. Set the authorized redirect URI to the **callback URL shown by Supabase's Google provider**, normally `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`.
4. In Supabase **Authentication → Sign In / Providers → Google**, enable Google and enter the client ID and client secret. Keep the secret in this dashboard.
5. If the Google app is in testing mode, add test users. Complete Google's publishing requirements before inviting users outside the test group.

The game’s **Continue with Google** button uses Supabase OAuth with PKCE. Supabase handles the provider callback and sends the player back to the game.

## 5. Enable Facebook login

1. Create/select an app at https://developers.facebook.com/ and add Facebook Login for the web.
2. Add your game's HTTPS domain and set **Valid OAuth Redirect URIs** to the callback URL shown by Supabase's Facebook provider, normally `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`.
3. In Supabase **Authentication → Sign In / Providers → Facebook**, enable the provider and enter your Facebook App ID and App Secret. Keep the secret in Supabase.
4. Use Meta's app roles/test users while testing. Follow Meta's current production requirements (including the app's required policy URLs and live mode) before inviting other players. The login requests the email permission.

## 6. Upload and verify

1. Upload the extracted website folder, including the edited `account-config.json`, `assets/`, and `index.html`, to **your existing Netlify site → Deploys**. Keep the same site address.
2. Reload the game. The player-account dialog should now enable the login buttons.
3. Test email, Google, and Facebook using provider-authorized test accounts. A disabled provider or incorrect callback configuration will produce a login error; the game cannot enable it automatically.
4. Sign in, change your callsign, and wait for **Cloud save up to date**. Complete level 1. Check the `player_saves` table for a row belonging to that user.
5. Sign in as the same user in a second browser and confirm your level, callsign, RP, and equipped skin return.
6. Sign out. Your original guest save should return. A different signed-in account should have its own independent save.

If you already played as a guest, sign in and choose **Bring guest progress into this account**. Confirm the replacement after exporting a backup if you want to retain both versions. Existing cloud progress is never automatically replaced by a guest save.

## Save behavior

- Profiles contain campaign completions and best stars/scores, rank points and peak rank, unlocked/equipped skins, XP, flight totals, and the last 30 flights.
- Graphics, sound, and controls remain specific to each device. Login sessions are maintained by the Supabase SDK.
- Each profile also has a device copy. Completed matches and changed cosmetics queue a cloud save. **Sync now** retries a failed upload; reconnecting/focusing the game also retries queued changes.
- Cloud saves use a revision check. If another device wrote a newer save, choose which complete profile to keep. Export a backup before replacing a profile. The game does not silently combine rank points or overwrite conflicting progress.
- A ranked sortie left in progress is recorded as a defeat when that profile is restored. Finish or leave the current flight before switching players.
- Ranked mode is an AI ladder with client-computed progression. It is not a public, cheat-resistant PvP leaderboard. The database isolates accounts; it does not verify combat outcomes server-side.
- Clearing browser storage removes guest saves and unsynced device progress. Use **Export backup**. Importing a valid backup replaces the current profile after confirmation.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Login buttons disabled | `account-config.json` is deployed beside `index.html`, contains valid public values, and has its exact JSON filename. Reload after deployment. |
| Email never arrives | Custom SMTP, recipient restrictions, rate limits, spam folder, and Email provider enabled. |
| OAuth redirects fail | Exact website redirect allowlist, provider callback URI, and Google/Meta test-user/live-mode settings. |
| Account signs in but cloud stays offline | SQL script ran in the same Supabase project as the public configuration; project is not paused; network is online. |
| Two saves need a choice | Another browser/device changed that account's save. Open the account dialog, export the current backup if needed, then choose cloud or device. |
| Error after restoring a backup | Choose a Skychrome JSON backup under 256 KB. Unsupported save versions are rejected. |

The automated tests exercise local progression, the real Postgres schema/permissions, SDK calls against a simulated account service, save conflicts, and offline retry. Live Google/Facebook/email delivery must be verified after you activate your actual provider projects.
