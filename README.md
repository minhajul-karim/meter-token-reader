# টোকেন রিডার — বিপিডিবি প্রিপেইড মিটার

**Live app:** [meter-token-reader.vercel.app](https://meter-token-reader.vercel.app) <!-- update with your actual Vercel URL -->

---

## Why this exists

Every time BPDB raises the electricity unit price, prepaid meter users receive a special adjustment SMS containing **11 tokens — 220 digits in total** — that must be entered into the meter one by one before it accepts any future recharge. There is no way around it.

Entering 220 digits manually is miserable: you have to switch back and forth between your phone's SMS inbox and the meter keypad, keep track of which token you're on, and start over if you lose your place. It typically takes two people — one to read, one to type.

This app solves that. Paste the SMS, and it reads each token aloud in Bengali, group by group, so you can type and listen at the same time — alone.

> Regular 20-digit recharge tokens are manageable on your own by glancing at the inbox. The 220-digit price hike token is what this app was built for.

---

## How it works

1. Paste your BPDB SMS into the app
2. It extracts all tokens automatically
3. It reads each 4-digit group aloud in Bengali (falls back to English if Bengali voice is unavailable on your device)
4. Type into the meter as it speaks → press Enter on the meter → tap "Enter চাপলাম" in the app
5. The app moves to the next token automatically

Works offline after first load. No account required, no data collected.

## Features

- Voice reads tokens in Bengali via Web Speech API
- Handles the full 220-digit price hike SMS (11 tokens in one paste)
- Installable as a PWA — add to home screen, works like a native app
- Adjustable reading speed
- Repeat button if you miss a group
- Supports Chrome and Samsung Browser on Android

## Tech stack

- React 18 + TypeScript
- Vite + Tailwind CSS v4
- `vite-plugin-pwa` for service worker and offline support
- `@vercel/analytics` for page view tracking
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build   # production build
npm run preview # preview production build locally
```

## Feedback

Found a bug or have a suggestion? [Fill out the feedback form](https://docs.google.com/forms/d/e/1FAIpQLSfhzCDRaTqxwwDBAD5s1pXASrN1tbJB0lxsjBZAjc3gUC37Tg/viewform) or visit the [Facebook page](https://www.facebook.com/profile.php?id=61590279887504).

Built by [Minhajul Karim](https://www.linkedin.com/in/minhajul/).
