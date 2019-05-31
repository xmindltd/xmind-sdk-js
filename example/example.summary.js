'use strict';

/**
 * Example.summary - Easy usage
 */

const { Workbook, Topic, Zipper } = require('xmind-sdk');

const wb = new Workbook();
const topic = new Topic({sheet: wb.createSheet('sheet-1', 'central topic')});


/** Range Graph
 ------------------------------------------
 |                   subtopic 1           |
 |                      /                 |
 Central topic -|       'main topic 4' -  subtopic 2     | ------- Summary title
 |                      \                 |
 |                   subtopic 3           |
 ------------------------------------------
 */

topic
  .on()
  // adding main topic 4 on central topic
  .add({title: 'main topic 4'})

  // In default, The topicId() returns id of `main topic 4`
  // Also topic.topicId('main topic 4') is working
  .on(topic.topicId())
  
  // adding some subtopics on `main topic 4`
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
  .add({title: 'subtopic 3'})
  
  // The summary will be attach on 'main topic 4' and contains all the sub topics
  .summary({title: 'Summary title 1'});


// You can do as below codes if just want the summary to contains subtopic 1 - 3

topic
  .on()
  .add({title: 'main topic 2'})
  .on(topic.topicId('main topic 2'))
  .add({title: 'subtopic 1 on main topic 2'})
  .add({title: 'subtopic 2 on main topic 2'})
  .add({title: 'subtopic 3 on main topic 2'})
  .add({title: 'subtopic 4 on main topic 2'})
  .on(topic.topicId('subtopic 1 on main topic 2'))
  .summary({title: 'contains subtopic 1 - 3', edge: topic.topicId('subtopic 3 on main topic 2')})


const zip = new Zipper({path: '/tmp', workbook: wb});
zip.save().then(status => status && console.info('Saved'));

