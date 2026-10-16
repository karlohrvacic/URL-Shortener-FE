# hrva.cc — URL Shortener Frontend

Next.js 16 App Router + React 19, deployed on Cloudflare Workers via `@opennextjs/cloudflare`.

See [AGENTS.md](./AGENTS.md) for architecture, commands, and gotchas. 

## Deployment

The production Cloudflare Worker `url-shortener` is connected to the
[HrvaLabs/URL-Shortener-FE](https://github.com/HrvaLabs/URL-Shortener-FE)
repository. Pushing to `main` triggers Workers Builds, using `npm run build`
and `npm run deploy`. Preview branches use a separate build trigger.
