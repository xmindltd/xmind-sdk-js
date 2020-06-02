'use strict';

/**
 * Loader fully example
 */

const { Loader, Topic, Zipper } = require('../dist');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const v4 = require('uuid').v4;

const main = async () => {
  const file = fs.readFileSync(path.resolve(__dirname, '../test/fixtures/default.xmind'));
  const loader = new Loader({ctx: await JSZip.loadAsync(file)});
  const sheets = await loader.loadSheets();
  
  let sheet;
  for (const key in sheets) {
    if (sheets[key].getTitle() === 'sheet-1') {
      sheet = sheets[key];
    }
  }
  
  const topic = new Topic({sheet: sheet, isLoaded: true});
  
  const resource = topic.cids();
  for (const topicId in resource) {
    console.info(resource[topicId]);
    if (resource[topicId] === 'Computer science') {
      topic
        .on(topicId)
        .add({id: v4(), title: 'New Computer Science'})
    }
  }
  
  const zip = new Zipper({ path: '/tmp', workbook: loader.getWorkbook() });
  return zip.save().then(status => status && console.info('saved!'));
};

main();