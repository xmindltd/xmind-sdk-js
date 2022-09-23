'use strict';


/**
 * Example.fully - Topic fully usage
 */


const { Topic, Workbook, Zipper, Marker } = require('../dist');

const workbook = new Workbook();
const topicOnSheet1 = workbook.createSheet('sheet-1', 'Computer science - 1');
const topic = new Topic({ sheet: topicOnSheet1 });


const workbook2 = new Workbook();
const createdSheetList = workbook2.createSheets([
  {s: 'sheetName1', t: 'rootTopicName1'},
  {s: 'sheetName2', t: 'rootTopicName2'},
  {s: 'sheetName3', t: 'rootTopicName3'}
]);

console.info(createdSheetList);
console.info('sheetList:', workbook2.getSheets());
console.info('sheet1', workbook2.getSheet(createdSheetList[0].id));

console.info(workbook2.toJSON());

const zip2 = new Zipper({path: '/tmp', workbook: workbook2});

// Set theme
workbook.theme('sheet-1', 'robust');
const zip = new Zipper({path: '/tmp', workbook});
const marker = new Marker();

topic
  .add({title: 'Programming Language'})
  .add({title: 'Software Name'})
  .add({title: 'Network device'})
  .add({title: 'Computer Brand'})
  .marker(marker.smiley('smile'))
  
  
  .on(topic.cid('Programming Language'))
  .add({title: 'dynamic'})
  .add({title: 'static'})
  
  .on(topic.cid()/* Also the topic.cid('static') is working */)
  .add({title: 'C'})
  .add({title: 'C++'})
  .add({title: 'Java'})
  .on(topic.cid('C'))
  .summary({title: 'Low level that is hard to learning', edge: topic.cid('C++')})
  
  .on(topic.cid('dynamic'))
  .note('The static languages are fast more than dynamic language')
  .add({title: 'Node.js'})
  .add({title: 'Python'})
  .add({title: 'Ruby'})
  .on(topic.cid('dynamic'))
  .summary({title: 'In popular'})


  // on Software
  .on(topic.cid('Software'))
  .add({title: 'jetBrains'})
  .add({title: 'Microsoft'})
  
  .on(topic.cid('jetBrains'))
  .marker(marker.smiley('smile'))
  .add({title: 'WebStorm'})
  .add({title: 'Pycharm'})
  .add({title: 'CLion'})
  .add({title: 'IntelliJ Idea'})
  .add({title: 'etc.'})
  .summary({title: 'all of the productions belongs to jetbrains'})
  
  .on(topic.cid('Microsoft'))
  .marker(marker.smiley('cry'))
  .add({title: 'vs code'});

zip.save().then(status => status && console.log('zip saved'));
zip2.save().then(status => status && console.log('zip2 saved'));