'use strict';

/**
 * Example.marker - Marker usage
 */


const { Workbook, Topic, Zipper, Marker } = require('xmind');

const wb = new Workbook();
const topic = new Topic({sheet: wb.createSheet('sheet-1', 'central topic')});

const zip = new Zipper({path: '/tmp', workbook: wb});

const marker = new Marker();

topic
  .add({title: 'main topic 1'})
  
  // attach markers to main topic 1
  .on(topic.cid())
  .marker(marker.smiley('cry'))
  .marker(marker.week('fri'))
  .marker(marker.smiley('laugh'))
  
  .on(topic.rootTopicId)
  .add({title: 'main topic 2'})

  // detach marker from main topic 1
  .on(topic.cid('main topic 1'))
  .marker(Object.assign({}, marker.smiley('cry'), {del: true}));

zip.save().then(status => process.exit(status ? 0 : 1));
