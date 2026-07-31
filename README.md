# Conroy's Flowers Training App - v1.15.0

Admin login → More tab → 「👔 Admin 관리」 → Open account management

**Default accounts (please change after first login):**

| Username    | Password       | Role     |
|-------------|----------------|----------|
| `admin`     | `AdminConroy26`| Admin    |
| `employee1` | `Trainee01`    | Employee |
| `employee2` | `Trainee02`    | Employee |
| `employee3` | `Trainee03`    | Employee |
| `employee4` | `Trainee04`    | Employee |
| `employee5` | `Trainee05`    | Employee |

Admin PIN (backup): `7890`

## v1.15.0 Changes
- Unified version number to 1.15.0 across all files
- Updated default passwords for better security (please change them)
- Knowledge base and system prompt better aligned
- Image loading improvements (lazy loading)
- Prepared structure for future offline support & quiz feature

## Previous (v1.14.x)
- Fixed version number display
- Admin panel only available when logged in as Admin
- First visit always starts in English
- Language selector restored (EN / 한국어 / 日本語 / ES)
- Voice functions converted to Netlify Functions v2
- Admin user list: add/delete works immediately

## Notes
- On Netlify, accounts are shared via Blobs across all devices.
- Set `XAI_API_KEY` in Netlify environment variables for voice (STT/TTS) and Grok answers.
- Push to GitHub → Netlify auto-deploys.
- **Image note**: Current JPG images are large. For best performance, convert them to WebP (recommended sizes: header ~400px wide, others ~800px max) and update references.
