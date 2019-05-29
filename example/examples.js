'use strict';

const { Workbook, Topic } = require('xmind-sdk');

const wb = new Workbook();
// sheet title: 'sheet-1'
// central topic title: 'central topics'
const topic = new Topic({sheet: wb.createSheet('sheet-1', 'central topic')});



// Example 1: add main topic on central topic
topic
  .on()
  .add({title: 'main topic 1'});

// Example 1.1: the same as Example 1
topic
  .on('central topic')
  .add({title: 'main topic 1.1'});



// Example 2: Error throws out if given an invalid topic title
try {
  topic
    .on('main topic 11') // The `main topic 11` does not exists. do not use non-exists title
    .add({title: 'subtopic 1'});
} catch (e) {
  console.info(e.message);// Expected: Invalid title `main topic 11`
  // Error: Invalid title
  // ...
  // ...
}


// Example 3: Add topic with a note message
topic
  .on()
  .add({title: 'main topic 3'})
  .on('main topic 3')
  .note('this is a note message');


// Example 4: Add subtopics with a summary component
topic
  .on('main topic 3')
  .add({title: 'subtopic 1'})
  .summary({title: 'Summary title'});


// Example 5:  Add a summary component with the range

/** Range Graph
               |-----------------------------------------
               |                   subtopic 1           |
               |                      /                 |
Central topic -|       'main topic 4' -  subtopic 2     | ------- Summary title
               |                      \                 |
               |                   subtopic 3           |
               ------------------------------------------
 */

topic
  .on('central topic')
  .add({title: 'main topic 4'})
  .on('main topic 4')
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
  .add({title: 'subtopic 3'})
  .add({title: 'subtopic 4'})
  .add({title: 'subtopic 5'})
  // The summary will be attach on 'main topic 4' and `included` subtopic 1, subtopic 2, subtopic 3
  .summary({title: 'Summary title', include: 'subtopic 3'});


// Example 5.1: only subtopics in a summary range
// just a little modification for above codes:
topic
  .on('central topic')
  .add({title: 'main topic 5'})
  .on('main topic 5')
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
  .add({title: 'subtopic 3'})
  .add({title: 'subtopic 4'})
  .on('subtopic 1')
  .summary({title: 'Summary title', include: 'subtopic 3'});
  // Now, The summary range includes subtopic 1, subtopic 2, subtopic 3
