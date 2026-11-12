# Frontend Practice

A collection of HTML, CSS and JavaScript practice projects. Each project is self-contained in its own folder.

| Project | What it is | Uses |
|---|---|---|
| [`ea-publishing`](ea-publishing/) | E.A Publishing LTD landing page with navbar | HTML, CSS |
| [`nazry-pharma`](nazry-pharma/) | Nazry Pharmaceuticals landing page with navbar | HTML, CSS |
| [`aura-motion`](aura-motion/) | Branding and web agency site: home, services, portfolio, reviews, mobile sidebar menu | HTML, CSS |
| [`zonar-studios`](zonar-studios/) | Fashion store: product image sliders, cart, favourites, customer reviews, newsletter | HTML, CSS, JS |
| [`cervex-auth`](cervex-auth/) | Register, login and dashboard flow | HTML, CSS, JS (localStorage) |
| [`js-exercises`](js-exercises/) | Conditional statement exercises (output in the browser console) | JS |

## Run a project

Open the project's `index.html` in your browser, or start a local server from the repo root:

```
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Folder layout

```
frontend-practice/
├── index.html          # links to every project
├── ea-publishing/      # index.html, css/, images/
├── nazry-pharma/       # index.html, css/, images/
├── aura-motion/        # index.html, portfolio.html, css/, images/
├── zonar-studios/      # index.html, css/, js/, images/, videos/
├── cervex-auth/        # index.html, login.html, register.html, dashboard.html, css/, js/
└── js-exercises/       # index.html, js/
```

## Images and videos

Image and video files are not included yet. Each project folder has an `ASSETS.md` listing the exact filenames it expects. Copy your files into the project's `images/` (or `videos/`) folder with those names. The three portfolio images in `aura-motion` are placeholders; replace them with your real work.

Keep filenames lowercase-friendly and free of spaces where you can. GitHub Pages is case-sensitive, so `Logo.png` and `logo.png` are different files there.

## Notes

- `cervex-auth` stores the user and password in plain text in `localStorage`. This is for practice only and is **not** real authentication.
- GitHub rejects single files over 100 MB. If your `zonar-studios` videos are large, compress them first.

## Known issues to look at later

- `zonar-studios/css/style.css` uses the font name `"Bondi Moda"` in the hero heading; the loaded font is `"Bodoni Moda"`.
- `aura-motion/css/style.css` uses the fonts Work Sans and Big Shoulders Display, but they are not loaded in the Google Fonts link, so browsers fall back to a default.
- `cervex-auth/css/main.css` uses the `Festive` font, which is not loaded on those pages.
- The navigation links in `ea-publishing` and `nazry-pharma` still point to `#`.

## Publish to GitHub

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/frontend-practice.git
git push -u origin main
```
