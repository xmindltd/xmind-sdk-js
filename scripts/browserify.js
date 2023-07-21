#!/bin/env node

'use strict';

const browserify = require('browserify');
const tsify = require('tsify');
const path = require('path');
const fs = require('fs');

const PATH = path.join(__dirname, '../dist/xmind-sdk.bundle.js');
const PATH_WITHOUT_SDK = path.join(__dirname, '../dist/xmind.min.js');

if (fs.existsSync(PATH)) fs.unlinkSync(PATH);

browserify()
  .add(path.join(__dirname, '../src/browser.ts'))
  .plugin(tsify, { noImplicitAny: false, target: 'es6' })
  .transform('babelify', {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    extensions: ['.ts', '.js']
  })
  .bundle()
  .on('error', function (error) { console.error(error.toString()); })
  .pipe(require('minify-stream')({ sourceMap: false }))
  .pipe(fs.createWriteStream(PATH).on('finish', () => {
    console.info(PATH);
    fs.createReadStream(PATH)
      .pipe(fs.createWriteStream(PATH_WITHOUT_SDK))
      .on('finish', () => {
        console.info(PATH_WITHOUT_SDK);
      })
  }));
