import { Workbook, Topic, Marker } from '../src';


// create workbook & sheet
const wb = new Workbook();
wb.createSheet('sheet-1','Root Topic');

// create topic
const topic = new Topic({sheet: wb.sheet})
const marker = new Marker();

topic
  .on()
  .add({title: 'main topic 1'})
  .on(topic.topicId())
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
  .add({title: 'subtopic 3'})
  .add({title: 'subtopic 4'})
  .on(topic.topicId('subtopic 2'))
  .note('this is a note record')
  .on(topic.topicId('subtopic 3'))
  .note('this is a note record attached on subtopic 3')
  .marker(marker.smiley('cry'))
  .on(topic.rootTopicId)
  .add({title: 'main topic 1'})
  .add({title: 'main topic 2'})
  .add({title: 'main topic 2.2'})
  .add({title: 'main topic 2.1'})

// be care of use topic.topicId(title)
// We've two `main topic 1`
// It will return the first element and it is non-fixed
console.info('Main topic Id:', topic.topicId('main topic 1'));
console.info(topic.topicIds());

wb.zipper.save().then(status => {console.info(status)});
