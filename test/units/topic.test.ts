import {Topic, Workbook, Zipper} from '../../src';
import {expect} from 'chai';
import * as fs from "fs";
import * as JSZip from 'jszip';

// @ts-ignore
const getComponents = function() {
  const workbook = new Workbook();
  const topic = new Topic({sheet: workbook.createSheet('sheet1', 'centralTopic')});
  const zip = new Zipper({path: '/tmp', workbook});
  return {topic, workbook, zip};
}

describe('# Topic Unit Test', () => {
  it('should be failed to create instance of Topic with empty options', done => {
    try {
      // @ts-ignore
      new Topic();
    } catch (e) {
      expect(e.message).to.be.eq('options.sheet is required');
      done();
    }
  });

  it('should be failed to add topic with empty title', done => {
    const {topic} = getComponents();
    try {
      topic.on().add();
    } catch (e) {
      expect(e.message).to.be.eq('topic.title should be a valid string');
      done();
    }
  });

  it('should be failed to add a topic with an invalid topicId', done => {
    const doesNotExists = 'this is a does not exists title';
    try {
      const {topic} = getComponents();
      topic
        .on()
        .add({title: 'main topic 1'})
        .on(doesNotExists);
    } catch (e) {
      expect(e.message).to.be.eq('Invalid topic id:' + doesNotExists);
      done();
    }
  });

  it('should be failed to destroy topic with invalid title', done => {
    const {topic, zip} = getComponents();
    topic
      .add({title: '1'})
      .add({title: '2'})
      .destroy('22');

    zip.save().then(async status => {
      expect(status).to.be.true;
      const p = '/tmp/default.xmind';
      const content = fs.readFileSync(p);
      JSZip.loadAsync(content).then(async zip => {
        const text = await zip.file('content.json').async('text');
        const map = JSON.parse(text)[0];
        expect(map).to.be.an('object');
        const {attached} = map.rootTopic.children;
        expect(attached.length).to.be.eq(2);
        fs.unlinkSync(p);
        done();
      });
    });
  });

  it('should be failed to add summary on central topic', done => {
    const {topic} = getComponents();
    topic.summary({title: 'Summary title'});
    done();
  });

  it('should be failed to add note with empty text', done => {
    const {topic} = getComponents();
    // @ts-ignore
    topic.note();
    done();
  });

  it('should return topics if topicIds called', done => {
    const {topic} = getComponents();

    topic
      .add({title: '1'})
      .add({title: '2'});

    const topics = topic.topicIds();
    expect(topics).to.have.property(topic.topicId('1'));
    expect(topics).to.have.property(topic.topicId('2'));
    expect(topics).to.have.property(topic.topicId('Central Topic'));
    expect(topics).to.have.property(topic.rootTopicId);
    done();
  });

});
