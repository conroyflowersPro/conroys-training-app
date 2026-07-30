# Conroy's Flowers Training App - v1.14.0

Admin login → More tab → 「👔 Admin 관리」 → Open account management

Default account: `admin` / `admin7890`  
Admin PIN (backup): `7890`

## v1.14.0 Changes
- Fixed version number display (now correctly shows v1.14.0)
- Admin panel / Admin card only available when logged in as **Admin** (triple-tap also restricted)
- First visit always starts in **English** (language is remembered after the user changes it)
- Language selector restored in the header (EN / 한국어 / 日本語 / ES)
- Voice functions (stt / tts / ask) converted to Netlify Functions v2 (fixes HTTP 404)
- Admin user list: add shows immediately, delete removes immediately (server + local)

## Notes
- On Netlify, accounts are shared via Blobs across all devices.
- Set `XAI_API_KEY` in Netlify environment variables for voice (STT/TTS) and Grok answers.
- Push to GitHub → Netlify auto-deploys.
