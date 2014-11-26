parched-tasks-webapp
====================

Uses features from Parched and browserify for pain free development times.
Bower is also supported, though not given the exact same treatement as
`app/` or `vendor/`.

You do have to structure your app a certain way:

```
app/
├── assets/
├── scripts/
├── styles/
└── views/
vendor/
├── assets/
├── scripts/
├── styles/
└── views/
```

However, given this:

```bash
npm install --save gulp parched parched-tasks-webapp
# Okay now we will install some plugins
npm install --save parched-coffee \
    parched-jade \
    parched-minify-css \
    parched-sass \
    parched-svg2png \
    parched-uglify \
    parched-webfont
```

... and a `Gulpfile.js` containing:

```javascript
Parched.setup({
  gulp: gulp,
  
  __before: function(done) {
    console.log('Before');
    done();
  },
  
  __after: function(done) {
    console.log('After');
    done();
  }
});
```

... you have a process that will:

- Support bower dependencies.
- Support coffeescript (in `vendor/scripts/` and browserify).
- Support jade (in `app/views/`, `vendor/views/` and browserify).
- Support sass (in `app/styles/` and `vendor/styles/`).
- Support ordering of any concat'd files via `before` and `after` properties.
- Build a webfont based on .svg files in `app/assets/glyphs/`.
- Build both a retina and non-retina spritemap based on .svg files in `app/assets/sprites/`.
- Minify javascript in production.
- Minify css in production.
- Error hard in production.
- Use browserSync in development.
- Stay out of your way.
- Allow you to intervene at pretty much any point.

Usage
-----

To cleanup `public/` and `tmp/`:

```bash
gulp webapp-clean
```

To watch files in development

```bash
gulp webapp-watch
```

To build everything:

```bash
gulp webapp-build-all
```

To build and minify everything:

```bash
NODE_ENV=production gulp webapp-build-all
```
