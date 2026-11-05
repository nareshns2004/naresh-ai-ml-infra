# portfolio-webapp

Portfolio site for Naresh Kumar: secure AI/ML infrastructure: GPU cluster networking, distributed training and zero trust for AI systems.
Live: https://portfolio-webapp-roan.vercel.app

Static HTML/CSS/JS, no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Layout

| Path | What |
|---|---|
| `index.html` | Homepage |
| `posts/*.html` | Interactive posts (simulators and calculators, no dependencies) |
| `assets/js/data.js` | Writing index: add a post by appending one object |
| `assets/js/security-data.js` | Stack layers + sourced AI-infra incidents (threat map, breach field guide) |
| `assets/js/threatmap.js`, `hero.js` | Homepage threat map / ticker; hero Fig. 0 |
| `assets/css/site.css` | Shared tokens, nav, buttons, footer |
| `assets/css/home.css`, `post.css` | Homepage / post layouts and widgets |
| `assets/js/site.js`, `post.js` | Shared behaviour / widget helpers |
| `og-image.png` | Share preview, rendered from `assets/og/og-source.html` at 1200×630 |

See `CLAUDE.md` for the rules the content follows and `TODO.md` for the backlog.
