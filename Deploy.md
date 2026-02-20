# Deployment Guide — CloudWatch Query Crafter

Target URL: `https://cwqc.itdb.io`

---

## 1. Vercel Deployment

### Initial Setup

1. Push the repo to GitHub (e.g. `github.com/<your-user>/cwqc`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js. Confirm these settings:

| Setting            | Value                |
| ------------------ | -------------------- |
| Framework Preset   | **Next.js**          |
| Build Command      | `bun run build`      |
| Install Command    | `bun install`        |
| Output Directory   | *(leave default)*    |
| Node.js Version    | 18.x or 20.x        |

4. Click **Deploy**.

### Bun on Vercel

Vercel supports Bun natively when a `bun.lock` file is present. If the build fails:

- Ensure `bun.lock` is committed (not in `.gitignore`).
- Alternatively, switch Install Command to `npm install` and Build Command to `npm run build`.

---

## 2. Custom Domain — `cwqc.itdb.io`

### Vercel Side

1. In the Vercel project dashboard go to **Settings > Domains**.
2. Add `cwqc.itdb.io`.
3. Vercel will show a CNAME verification record.

### DNS Side (Squarespace)

1. Log in to Squarespace Domains for `itdb.io`.
2. Go to **DNS Settings > Custom Records**.
3. Add a **CNAME** record:

| Host   | Type  | Data                     | TTL  |
| ------ | ----- | ------------------------ | ---- |
| `cwqc` | CNAME | `cname.vercel-dns.com.`  | 3600 |

4. Save and wait for propagation (usually < 5 minutes, can take up to 48 hours).

---

## 3. SSL / HTTPS

Vercel auto-provisions a TLS certificate via Let's Encrypt once DNS resolves. No manual action required. If it doesn't provision within a few minutes:

- Verify the CNAME record is correct with `dig cwqc.itdb.io CNAME`.
- Check the Vercel Domains page for error messages.

---

## 4. Troubleshooting

| Issue                        | Fix                                                                 |
| ---------------------------- | ------------------------------------------------------------------- |
| DNS not resolving            | Wait for propagation; confirm CNAME with `dig` or `nslookup`       |
| Vercel domain verification   | Ensure the CNAME target is exactly `cname.vercel-dns.com`           |
| SSL certificate pending      | DNS must resolve first; wait and check Vercel dashboard             |
| Bun build fails on Vercel    | Ensure `bun.lock` is committed; try `npm install && npm run build`  |
| 404 after deploy             | Confirm `app/page.tsx` exists and the build succeeded               |
