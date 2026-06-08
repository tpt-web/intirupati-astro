# InTirupati Astro

A Cloudflare Pages-ready Astro website for Tirupati blogs, Shayari, Quotes, SEO tools, and devotional prompts.

## What changed

- Added Decap CMS admin at `/admin`
- Configured GitHub backend content editing via Cloudflare Functions OAuth
- Added collections for Blog Posts, Shayari, Quotes, SEO Tools, and Devotional Prompts
- Stored CMS content in `/src/content`
- Added media uploads to `/public/uploads`
- Improved SEO support with sitemap, robots.txt, Open Graph, and canonical URLs
- Removed Netlify Identity and Netlify Git Gateway usage in favor of GitHub + Cloudflare

## Project structure

```text
├── functions/              # Cloudflare Pages Functions for GitHub OAuth
├── public/
│   ├── admin/             # Decap CMS admin interface and config
│   ├── uploads/           # Image/media uploads committed to GitHub
│   └── robots.txt
├── src/
│   ├── components/
│   ├── content/           # Markdown collections managed by Decap CMS
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Content collections

- `blog` → `src/content/blog`
- `shayari` → `src/content/shayari`
- `quotes` → `src/content/quotes`
- `tools` → `src/content/tools`
- `prompts` → `src/content/prompts`

## Admin panel

Open:

```text
https://<your-site-domain>/admin/
```

The admin panel uses Decap CMS and commits edits directly to GitHub.

## GitHub OAuth setup

1. Create a GitHub OAuth App at `https://github.com/settings/developers`
2. Set the Authorization callback URL to:
   - `https://<your-cloudflare-pages-domain>/auth`
3. Add the following Cloudflare Pages environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
4. Deploy the site to Cloudflare Pages.

## Media uploads

Uploaded images and media are stored in `public/uploads` and served from `/uploads`.

## Local development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Deployment

1. Connect this repo to Cloudflare Pages.
2. Set the build command to:
   - `npm run build`
3. Set the build output directory to:
   - `dist`
4. Do not set a custom deploy command. Leave the deploy command blank.
5. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to Cloudflare Pages environment variables.
6. Publish the site.

## SEO support

- `astro-sitemap` generates a sitemap
- `public/robots.txt` allows site crawling and excludes `/admin` and `/auth`
- `src/components/BaseHead.astro` provides Open Graph and canonical metadata
- `rss.xml.js` remains available for feeds

## Notes

- The site continues to use the existing Astro structure and functionality.
- The Decap CMS GitHub backend avoids Netlify Identity or any paid authentication service.
- All content edits made in the admin UI are committed directly to GitHub and can trigger Cloudflare Pages redeploys.

