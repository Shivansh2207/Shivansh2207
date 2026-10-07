# Profile artwork

The profile uses original local SVG artwork in a midnight, lime, violet, and ice-blue palette. The banner, orbit, pixel arcade, section labels, buttons, toolkit, and footer are built by `scripts/build-art.mjs`. SVG animations use CSS, require no JavaScript in the README, and respect reduced-motion preferences. Every image has alternative text. Mobile layouts use GitHub-supported picture sources.

The arcade is an autoplay illustration, not a playable shooter. The three developer side quests are clickable native details elements that reveal their outcomes. No JavaScript, external game service, invented scores, or project gallery is involved.

## Edit and regenerate

Use Node.js 22 or newer:

```sh
npm ci --ignore-scripts
npm run build:art
npm run refresh
npm run preview
```

`refresh` uses `GITHUB_TOKEN` or `GH_TOKEN`; locally it can reuse `gh auth login`. Credentials remain in process memory. Never paste a token into a file or README. `preview` needs an authenticated GitHub CLI to render the README with GitHub's Markdown API and serves it on localhost:4177. Its temporary output is ignored by Git.

Automatic refresh is not enabled yet: the current GitHub CLI credential lacks the `workflow` scope, and the connected GitHub app also denied workflow creation. All images are generated, committed, and working; their displayed date is the last successful snapshot. You can refresh them locally with `npm run refresh` and commit the updated images.

A ready-to-install Action is included in [profile-assets.workflow.yml](./profile-assets.workflow.yml). To enable it, authorize workflow uploads with `gh auth refresh -h github.com -s workflow`, then move the template to `.github/workflows/profile-assets.yml`, commit, and push. Alternatively, add that file through GitHub's web editor while signed into an account allowed to manage workflows.

Once installed, the Action runs daily at 02:17 UTC (07:47 IST), manually from Actions, or when its generator files change on `main`. It uses the built-in repository token and only commits generated artwork. No separate personal access token is needed on GitHub. Schedules may be delayed by GitHub; if refresh fails, existing committed images remain available. GitHub may disable scheduled workflows after 60 days without repository activity; re-enable under Actions if needed.

The stats use GitHub's rolling twelve-month contribution calendar, public owned repository count, active contribution days, and the highest weekly contribution count. Weekly bars include partial weeks at either end. These are activity metrics, not measures of code quality. The snake uses the same GitHub contribution source, with separate light and dark palettes.

## Sources and credits

- Contribution snake: [Platane/snk](https://github.com/Platane/snk), via the pinned `generate-snake-animation` npm package. Snake animation is visual, not an interactive game.
- [Readme Typing SVG](https://github.com/DenverCoder1/readme-typing-svg) informed the terminal-motion research; this profile's cursor and artwork are implemented locally.
- GitHub-supported [collapsed sections](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-collapsed-sections) power the developer-console reveal.

All profile images are committed in `assets/`; viewing the profile does not depend on an external stats-card service. GitHub's image cache can delay a newly committed image appearing on the profile.
