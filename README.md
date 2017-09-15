Flying Assets Webpack Plugin
==========

A Webpack plugin generates launching HTML for both development and production.

**This plugin is at very early stage. It just works good with my practices. Please let me know your idea. Pull Requests are welcome.**

## Install

```sh
npm install --save-dev flying-assets-webpack-plugin
```

## Usage

### Prepare your HTML page

Currently only [pug](https://pugjs.org/) is supported.

#### `index.pug`

```pug
doctype html

meta(charset='utf-8')
meta(name='viewport', content=[
  'width=device-width',
  'initial-scale=1.0',
  'maximum-scale=1.0',
  'minimum-scale=1.0',
  'user-scalable=no'
].join(', '))

title My Awesome React Project
#root #{html}

mixin assets_for(chunk)
  if assets[chunk] && assets[chunk].styles
    each asset in assets[chunk].styles
      link(rel='stylesheet', href=`${publicPath}${asset}`)
  if assets[chunk] && assets[chunk].scripts
    each asset in assets[chunk].scripts
      script(src=`${publicPath}${asset}`)

+assets_for('main')
```

#### `webpack.*.js`

```js
const FlyingAssetsPlugin = require('flying-assets-webpack-plugin');

module.exports = {
  /* ... */
  plugins: [
    /* ... */
    new FlyingAssetsPlugin('index.pug'),
  ]
};
```

### For development

```js
import express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackAssetsMiddleware from 'flying-assets-webpack-plugin/middleware';
import webpackConfig from '../webpack.dev';

const app = express();

/* ... */

const compiler = webpack(webpackConfig);
const publicPath = webpackConfig.output.publicPath;

app.use(webpackDevMiddleware(compiler, {
  /* ... */
}));
app.use(webpackHotMiddleware(compiler));
app.use(webpackAssetsMiddleware(compiler));

/* ... */
```

### For production

```js
import express from 'express';
import { join } from 'path';

const assets = join(__dirname, '..', 'dist');

const app = express();

/* ... */

app.use('/assets', express.static(assets));
app.use((req, res, error) => {
  res.sendFile(join(assets, 'index.html'));
});

/* ... */
```

## License

[MIT License](LICENSE)
