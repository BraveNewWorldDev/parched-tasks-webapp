parched-tasks-webapp
====================

Uses features from [Parched](https://github.com/raisedmedia/parched) and
browserify for pain free development times.
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

  parchedWillBuild: function(done) {
    console.log('Before');
    done();
  },

  parchedDidBuild: function(done) {
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
gulp parched-clean
```

To watch files in development

```bash
gulp parched-watch
```

To build everything:

```bash
gulp parched-build
```

To build and minify everything:

```bash
NODE_ENV=production gulp parched-build
```

Bundles
-------

`parched-tasks-webapp` has a concept of "bundles". Directories of files
are considered to be a "bundle", provided there is some configuration.

The default bundle is `app`, and its configuration looks like:

```javascript
Parched.setup({
  webapp: {
    bundles: {
      app: {
        src: './app/',
        dest: './public/',
        shouldCopyVendor: true,
        shouldConcatVendor: false
      }
    }
  }
})
```

What this means is scripts in `./app/` will be built as
`./public/app.js`, styles will be concated to `./public/app.css`,
and any assets / views will go to `./public/`.

The `src` property will default to the bundle name and if no bundles
specify `shouldCopyVendor` then it is set for you on the first bundle.
Set `shouldConcatVendor` if you would like the vendor scripts and styles
to be concated to the beginning of the bundle files.

**Note for Parched plugin authors**

Because this behavior is specific to `parched-tasks-webapp` and messes
up any generic paths your workflow may assume, check for
`streamContext.bundleName` in your plugins method.

```javascript
export default function (Parched) {
  Parched.createPlugin({
    displayName: 'my-awesome-plugin',
    
    transform (streamContext) {
      let src = '**/*.svg'
      let dest = 'public/'
      
      if (streamContext.bundleName) {
        // we are being called by `parched-tasks-webapp`
        src = `${streamContext.bundleSrc}/**/*.js`
        dest = streamContext.bundleDest
      }
    }
  })
}
```
