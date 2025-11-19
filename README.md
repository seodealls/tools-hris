# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
## 🧩 Tailwind CSS — Setup & Notes

If you use Tailwind in this project, here's how the local setup is configured and how to get Tailwind working.

Prerequisites
- This repo uses a pnpm lockfile. For a repeatable install, prefer pnpm. But npm or yarn will also work.

Vite plugin (Tailwind v4) — recommended for latest Tailwind
- We use Tailwind v4 with the Vite plugin in this project. This enables faster startup and modern Tailwind features.
- Packages installed: `tailwindcss@^4`, `@tailwindcss/vite`, `@tailwindcss/postcss`, `postcss`, `autoprefixer`.

Steps to run
1. Install dependencies (pnpm recommended):
	 ```bash
	 pnpm install
	 ```
2. Start dev server:
	 ```bash
	 pnpm dev
	 ```

Where CSS goes
- Global Tailwind CSS lives in `src/styles/global.css` — it is imported in `src/layouts/Layout.astro` with `import "../styles/global.css";`.
- For Vite plugin, `global.css` usually uses:
	```css
	@import "tailwindcss";
	```

Tailwind Configuration
- `tailwind.config.cjs` contains the `content` paths; make sure it includes `./src/**/*.{astro,html,js,jsx,ts,tsx}` so Astro pages/components are scanned.

Testing
- I added a quick test h1 in `src/pages/index.astro` with classes: `text-3xl font-bold underline`. Visit `http://localhost:4321` to verify.

Troubleshooting
- If Tailwind classes do not appear: ensure `src/styles/global.css` is imported in a top-level layout or in the page.
- If you see a PostCSS error about `@tailwindcss/postcss` or `tailwindcss` plugin: install missing package via pnpm/npm.

Alternative: Astro integration (Tailwind v3)
- If you'd prefer to use the official Astro integration `@astrojs/tailwind` (recommended for a simple setup), install and use Tailwind v3 instead.
- To do that, revert `astro.config.mjs` to:
	```js
	import tailwind from '@astrojs/tailwind';

	export default defineConfig({
		integrations: [tailwind(), react()],
	});
	```
- Then install Tailwind v3 and the integration plugin:
	```bash
	pnpm add -D tailwindcss@^3 @astrojs/tailwind autoprefixer postcss
	```

If you want me to edit the config to use the Astro integration instead of the Vite plugin, I can do that for you.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
