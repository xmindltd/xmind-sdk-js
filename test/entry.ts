import {Workbook, Topic, Marker} from '../src';


const workbook = new Workbook();
const sheetTitle = 'sheet-1';
const topic = new Topic({sheet: workbook.createSheet(sheetTitle)});
workbook.theme(sheetTitle, 'robust');

const marker = new Marker();

// assign topic
topic.on()
  .add({title: 'main topic 1'})
  .add({title: 'main topic 2'})
  .add({title: 'main topic 3'})
  .add({title: 'main topic 4'});

topic.on('main topic 1')
  .note('add a note to main topic 1')
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
  .add({title: 'subtopic 3'})
  .add({title: 'subtopic 4'})
  .marker(marker.smiley('cry'));

topic
  .on('subtopic 1')
  .add({title: 'whatever it is'})
  .on('whatever it is')
  .note('this is a note text');

topic
  .on('main topic 1')
  .summary({title: 'test summary', include: 'main topic 4'})
  .on('test summary')
  .add({title: 'subtopic of summary 1'})
  .add({title: 'subtopic of summary 2'})
  .add({title: 'subtopic of summary 3'});

try {
  topic
    .on('does not exists')
    .add({title: 'test title'});
} catch (e) {
  console.info(e.message);// expected: Invalid title `does not exists`
  console.info('adding test title failures');
}

workbook.zipper.save().then(status => {console.info(status)});
