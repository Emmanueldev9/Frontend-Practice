# Frontend Practice

A collection of HTML, CSS and JavaScript practice projects. Each project is self-contained in its own folder.

| Project | What it is | Uses |
|---|---|---|
| [`aura-motion`](aura-motion/) | Branding and web agency site: home, services, portfolio, reviews, mobile sidebar menu | HTML, CSS |
| [`zonar-studios`](zonar-studios/) | Fashion store: product image sliders, cart, favourites, customer reviews, newsletter | HTML, CSS, JS |

## Run a project

Download the repo, then open the project's `index.html` in your browser.

## Folder layout

```
frontend-practice/
├── index.html
├── aura-motion/     # index.html, portfolio.html, css/, images/
└── zonar-studios/   # index.html, css/, js/, images/, videos/
```

## Images and videos

Image and video files are not included yet. Each project folder has an `ASSETS.md` listing the exact filenames it expects. Add your files to the project's `images/` or `videos/` folder using those names. The three portfolio images in `aura-motion` are placeholders.

GitHub Pages is case-sensitive, so `Logo.png` and `logo.png` are different files there.

## Notes

- GitHub rejects single files over 100 MB. If your `zonar-studios` videos are large, compress them first.

## Known issues to look at later

- `zonar-studios/css/style.css` uses the font name "Bondi Moda" in the hero heading, but the loaded font is "Bodoni Moda".
- `aura-motion/css/style.css` uses the fonts Work Sans and Big Shoulders Display, but they are not loaded in the Google Fonts link.
