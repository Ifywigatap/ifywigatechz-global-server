# Secure Credentials — immediate steps

1) Rotate any credentials that were committed
- Change the MongoDB user password in MongoDB Atlas and update any services using it.
- Rotate API keys (Paystack, Cloudinary, third-party services) if they were exposed.

2) Stop tracking `server/.env` in git (do this locally, then commit and push)

    # remove .env from the index but keep the file locally
    git rm --cached server/.env
    git commit -m "Remove server/.env from repo"
    git push origin HEAD

3) Remove secrets from repository history (optional but recommended)
- Recommended tool: `git filter-repo` (faster and safer than filter-branch).

Example (use with caution):

    # remove all file contents named server/.env from history
    git filter-repo --path server/.env --invert-paths

If you cannot use `git filter-repo`, see the BFG Repo-Cleaner or `git filter-branch` docs.

4) Ensure `.gitignore` contains `.env` (already present in this repo at `server/.gitignore`).

5) After rotation, update your deployment environment variables using your host's secrets manager (Render/Heroku/Netlify/Vercel) — do NOT store secrets in the repo.

6) Verify application connection after whitelist and rotation

    # from the server folder
    cd "C:\Users\hp\Documents\My  Projects\ifywigatechz-site\server"
    npm run dev

Check the server logs for a successful MongoDB connection line: `MongoDB Connected:` or similar.
