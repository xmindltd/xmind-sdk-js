#!/bin/env node

'use strict';

const browserify = require('browserify');
const tsify = require('tsify');
const path = require('path');
const fs = require('fs');

const PATH = path.join(__dirname, '../dist/xmind-sdk.bundle.js');

if (fs.existsSync(PATH)) fs.unlinkSync(PATH);

browserify()
  .add(path.join(__dirname, '../src/browser.ts'))
  .transform('unassertify', { global: true })
  .transform('envify', { global: true })
  // .transform('uglifyify', { global: true })
  .plugin(tsify, { noImplicitAny: false })
  .plugin('common-shakeify')
  .plugin('browser-pack-flat/plugin')
  .bundle()
  .on('error', function (error) { console.error(error.toString()); })
  .pipe(require('minify-stream')({ sourceMap: false }))
  .pipe(fs.createWriteStream(PATH));
