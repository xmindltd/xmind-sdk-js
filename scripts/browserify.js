#!/bin/env node

'use strict';

const browserify = require('browserify');
const tsify = require('tsify');
const path = require('path');
const fs = require('fs');

const PATH = path.join(__dirname, '../dist/bundle.js');

if (fs.existsSync(PATH)) fs.unlinkSync(PATH);

browserify()
  .add(path.join(__dirname, '../src/index.ts'))
  .plugin(tsify, { noImplicitAny: false })
  .bundle()
  .on('error', function (error) { console.error(error.toString()); })
  .pipe(fs.createWriteStream(PATH));
