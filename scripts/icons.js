#!/usr/bin env

'use strict';

const markers = require('./marker');
const { writeFileSync } = require('fs');
const path = require('path');

const header = '# Markers\n';
const usage = '\n## Usage\n\
\`\`\`js \
\n> const { Marker } = require("xmind-sdk"); \
\n \
\n> const marker = new Marker(); \
\n> const valueObject = marker.other("bomb"); \
\n> console.info(valueObject); \
\n{groupId: ..., markerId: ...} \
\n\`\`\`\n\
';

const groups = '\n## Groups\n';

let contents = '\n';

const height = '32px';
const width = '32px';

for (const key in markers) {
  contents += `### .${key}\n\n`
  for (const name in markers[key]) {
    if (!markers[key].hasOwnProperty(name)) continue;
    contents += `* <img src="${markers[key][name].href}" width="${width}" height="${height}"> - Name: \`${name}\` \n`;
  }
  contents += '\n';
}

writeFileSync(path.join(__dirname, '../docs/icons.md'), `${header}${usage}${groups}${contents}`, {encoding: 'utf8'});

