'use strict';


/**
 * Example.image - Insert image on topic
 */


const {Topic, Workbook, Zipper} = require('xmind-sdk');
const fs = require('fs');

const workbook = new Workbook();
const sheet = workbook.createSheet('sheet-1', 'Computer science');

const topic = new Topic({sheet});
const zip = new Zipper({path: '/tmp', workbook});


topic
  .add({title: 'main topic 1'})
  .add({title: 'main topic 2'});

  // Insert image on `main topic 1`
  const imageKey = topic.on(topic.cid('main topic 1')).image();
  const ctx = fs.readFileSync(join(__dirname, '../fixtures/19442.png'));
  zip.updateManifestMetadata(imageKey, ctx);
  // zip.save().then();