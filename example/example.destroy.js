'use strict';

const { Workbook, Topic, Zipper, Marker } = require('xmind-sdk');

const workbook = new Workbook();
const topic = new Topic({sheet: workbook.createSheet('sheet-1', 'central topic')});

const marker = new Marker();
const zip = new Zipper({path: '/tmp', workbook});

const mainTopic1 = topic.add({title: 'main topic 1'}).cid();
const mainTopic2 = topic.add({title: 'main topic 2'}).cid();
const mainTopic3 = topic.add({title: 'repeated'}).cid();
const mainTopic4 = topic.add({title: 'repeated'}).cid();


topic
  .on(mainTopic1)
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'});

const subtopic1 = topic.on(mainTopic3).add({title: 'subtopic 1'}).cid();
topic.on(subtopic1)
  .note('this is a note text')
  .marker(marker.smiley('cry'))
  // destroy marker from current component
  .marker(Object.assign({}, marker.smiley('cry'), {del: true}));
  
const summaryId = topic.summary({title: 'Summary'}).cid();

// The destroyed operation does not depends on the parent node
topic
  .destroy(topic.cid('subtopic 2'))
  .destroy(mainTopic4)
  .destroy(summaryId)
  .destroy(mainTopic2);

zip.save().then(status => status && console.log('Saved'));

