import {Workbook, Topic} from '../src';


// create workbook & sheet
const wb = new Workbook();
wb.createSheet('sheet-1','Root Topic');

// create topic
const topic = new Topic({sheet: wb.sheet});

topic
  .on()
  .add({title: 'main topic 1'});

const mainTopic1Id = topic.topicId();

topic
  .on(mainTopic1Id)
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
  .add({title: 'subtopic 3'})
  .add({title: 'subtopic 4'})

console.info('===========', topic.topicIds());

console.info(wb.toString());
wb.zipper.save().then(status => {console.info(status)});
