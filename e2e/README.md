# FHIL responsive UI QA (Playwright)

Automated responsive QA (no committed screenshot baselines).

## Coverage

| Screen | Route |
|--------|--------|
| Login (home) | `/` |
| Login | `/login` |
| Select Auction | `/auction` |
| New Auction | `/auction/new` |
| Users | `/users` |
| Conditions | `/conditions` |
| Auction detail | `/auction/ABAB012` |
| View images | `/auction/ABAB012/images` |

**Viewports:** 320, 375, 414, 768, 1024, 1280, 1920 (plus Tailwind edge widths 639/640, 1023/1024, 1279/1280).

**Checks:**

- No page-level horizontal overflow
- Fixed header + main padding
- Mobile vs desktop navigation (`lg` = 1024px)
- Mobile nav, delete modal, image lightbox, table scroll, login flow, detail → images link

Visual snapshot PNGs are **gitignored** under `e2e/**/__screenshots__/` if you generate them locally for ad-hoc review.

## Commands

From `frontend/`:

```bash
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:report
npm run test:all
```

## CI

`.github/workflows/frontend-responsive-e2e.yml`

## Environment

- `PLAYWRIGHT_BASE_URL` — default `http://localhost:3001`
- `CI=true` — fresh dev server, retries enabled
