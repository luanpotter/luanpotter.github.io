# luanpotter.github.io

[![CI](https://img.shields.io/github/actions/workflow/status/luanpotter/luanpotter.github.io/ci.yaml?logo=github&style=flat-square)](https://github.com/luanpotter/luanpotter.github.io/actions/workflows/ci.yaml)
[![Deployment](https://img.shields.io/github/actions/workflow/status/luanpotter/luanpotter.github.io/deploy.yaml?label=deployment&logo=github&style=flat-square&color=blue)](https://luan.xyz)
[![RSS](https://img.shields.io/badge/feed-rss-e07020?style=flat-square&logo=rss)](https://luan.xyz/rss.xml)

A home for my stuff, built with [astro](https://astro.build) and deployed to [GitHub Pages](https://luan.xyz).

## Structure

- `src/` - Astro-processed files
- `public/` - Static assets, copied as-is
- `projects/` - Pre-built project deployments
- `scripts/` - Development and CI scripts

## Development

Contributions are welcome! To setup and run locally, use the provided scripts:

```bash
./scripts/build.sh # builds the project to dist folder
./scripts/lint.sh [--fix] # lints the code, use --fix to auto-fix issues
```

Independent projects can be "pulled" separately into the `projects/` folder using the provider `pull_x.sh` scripts.

To run astro locally with hot reload:

```bash
bun run dev
```
