# Sk Nayem Uddin — portfolio

Live at **https://shak-nayem-uddin.github.io**

- Content (pages, sections, photos, contact details) is edited in the admin panel and stored in Google Sheets.
- The site reads that content, plus the achievement journal, from a Google Apps Script feed each time it loads.
- `data.json` is a recent copy of the feed, refreshed by the GitHub Action in `.github/workflows/refresh.yml`, used for a fast first paint and as a fallback.
- `img/` holds the original photos; new photos uploaded through the admin panel live in Google Drive.
