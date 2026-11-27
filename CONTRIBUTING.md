# Contributing

Thanks for helping improve Starlit Library Theme. Issues and pull requests are welcome in English or Traditional Chinese（歡迎使用繁體中文）.

## Before you start

- **Bug?** Open a [bug report](https://github.com/hakuei0115/Starlit-Library-Theme/issues/new?template=bug_report.yml) with steps to reproduce it.
- **New feature or visual change?** Open a [feature request](https://github.com/hakuei0115/Starlit-Library-Theme/issues/new?template=feature_request.yml) first, so we can agree on the direction before you write code.
- **Small fix** (typo, obvious bug)? A pull request is enough.

## Local setup

You need Node.js `>= 22.23.4`.

```sh
git clone https://github.com/<your-account>/Starlit-Library-Theme.git   # your fork
cd Starlit-Library-Theme
npm install
npm run dev        # http://localhost:4321
```

## Check your change

CI runs these two commands on every pull request. Run them locally first:

```sh
npx astro check
npm run build
```

`npm run build` warns that no site URL is set. That is expected during local development.

For visible changes, also check:

- Narrow (about 390 px) and wide (about 1440 px) screens, with no sideways scrolling of the page
- Keyboard use, with a visible focus style on anything clickable
- Reduced motion (`prefers-reduced-motion`) if you add animation

## Guidelines

- **Keep it a theme.** Anything a site owner would want to change belongs in `src/site.config.ts`, not in a component.
- **Use the design tokens** in `src/styles/tokens.css` for colors, spacing, radii and motion.
- **Keep it lightweight.** The theme currently uses only Astro components, CSS and small scripts, with no front-end UI framework. If you think a feature needs one, open an issue first so we can discuss it. Pages should stay readable without JavaScript.
- **Ask before adding a dependency**, and explain in the pull request why it is needed.
- **Artwork:** only add images you have the right to share under this project's license. The bundled artwork is meant to be replaced by each site owner, so please keep new defaults simple and generic, without personal content.
- **Update both READMEs** (`README.md` and `README.zh-TW.md`) when behavior or configuration changes.
- **Don't write interface text into components.** Add it to `src/i18n/ui.ts` in both Traditional Chinese and English.

## Commits and pull requests

- Keep each pull request to one topic.
- Commit messages follow the style already in the history: `feat: …`, `fix: …`, `docs: …`, `chore: …`.
- Describe what changed and why. Add screenshots for visual changes.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
