# Backup and restore

The site has three parts. Each one is kept in two places.

| Part | Main copy | Backup |
|---|---|---|
| Site code (pages, design, 3D, images) | This GitHub repository | Every change is kept in the Git history; a zip copy is in the Google Drive folder "Portfolio website backup" |
| Content (Web Settings, Web Sections, Web Photos, Achievement Journal) | The Google Sheet | `data.json` in this repository, refreshed every hour, so the Git history holds a copy of every past version; a full copy of the sheet is in the Drive backup folder |
| Apps Script (the feed and the admin panel) | The script attached to the Google Sheet | `backup/apps-script/` here; the Drive backup folder has the same files and a sheet copy that carries the script with it |

Last full backup: 18 November 2026.

## If the Apps Script is lost or broken

1. Open the content sheet, then Extensions > Apps Script.
2. Replace `Code.gs` with `backup/apps-script/Code.gs`, and add an HTML file named `Admin` with the contents of `Admin.html`.
3. In `Code.gs`, put the photo folder ID back into `PHOTO_FOLDER_ID` (the Drive copy of `Code.gs` has it).
4. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
5. If the web app URL changed, update `FEED` in `index.html` and in `.github/workflows/refresh.yml`.

## If the sheet is lost

Use the sheet copy in the Drive backup folder, or rebuild the tabs from the latest `data.json`. Then point the Apps Script at the new sheet as above.

## If this repository is lost

Create a new repository named `<username>.github.io`, upload the contents of the Drive zip, and turn on GitHub Pages for the `main` branch.
