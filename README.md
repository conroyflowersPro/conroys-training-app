# Conroy's Flowers Training App - v1.20.0

Floral Sales Representative Training PWA (Progressive Web App)

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

## v1.20.0 Changes
- Detailed guides for brand-new staff (`CF_GUIDE_DETAIL`) with goal / before / steps / never / done structure
- Guide modals + TTS Read aloud (xAI preferred, browser fallback)
- Home quick buttons and nav route to detailed guide modals (guide-router)
- Answer UI refinements: short answers + related guide button inside chat
- Default EN UI, language selector hidden for staff
- Image optimization (WebP + GitHub Action) complete

## Image Workflow (중요 – 앞으로 이렇게만 하세요)
1. `images/ui/` 또는 `images/guides/` 폴더에 **원본 JPG/PNG만** 올린다.
2. GitHub에 push한다.
3. GitHub Action이 자동으로 `.webp`를 생성하고 커밋한다.
4. 코드에서는 항상 `.webp` 경로를 사용한다.

- UI 폴더: 가로 600px / quality 80
- Guides 폴더: 가로 1000px / quality 80
- 파일명: 영문 소문자 + 하이픈 권장 (예: `cooler-vase.jpg`)

원본 JPG는 Action 재생성용으로 유지한다. 삭제하지 마세요.

## Previous (v1.18.0 ~ v1.19.x)
- Prefer server TTS (xAI) for Read aloud
- Default EN, hide lang select for staff
- Guide modal TTS + sentence cache
- Answer-ui short answers + related guide button

## Previous (v1.16.1)
- **All images converted to optimized WebP** and code paths switched
- GitHub Action auto-converts any new JPG/PNG → WebP on push
- Significant size reduction (most images 60-80% smaller)
- UI images resized to max 600px wide, Guides to 1000px
- Lazy loading already in place
- Cache headers tuned for WebP (long immutable cache)

## Previous (v1.15.0)
- Unified version number to 1.15.0 across all files
- Updated default passwords for better security
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
- Images: use WebP only in code. Action handles conversion automatically.
