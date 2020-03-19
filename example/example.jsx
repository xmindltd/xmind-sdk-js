import { Workbook, Topic, Marker, Zipper } from 'xmind';

const wb = new Workbook();
wb.createSheet('sheet-1','Root Topic');
const topic = new Topic({sheet: wb.sheet})
const marker = new Marker();

topic
  .on()
  .add({title: 'main topic 1'})
  .on(topic.cid())
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
  .add({title: 'subtopic 3'})
  .add({title: 'subtopic 4'})
  .on(topic.cid('subtopic 2'))
  .note('this is a note record')
  .on(topic.cid('subtopic 3'))
  .note('this is a note record attached on subtopic 3')
  .marker(marker.smiley('cry'))
  .on(topic.rootTopicId)
  .add({title: 'main topic 1'})
  .add({title: 'main topic 2'})
  .add({title: 'main topic 2.2'})
  .add({title: 'main topic 2.1'})

console.info('Main topic Id:', topic.cid('main topic 1'));
console.info(topic.cids());

const zip = new Zipper({path: '/tmp', workbook: wb});
zip.save().then(status => {console.info(status)});
