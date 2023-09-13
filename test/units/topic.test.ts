import {Topic, Workbook, Zipper, Marker} from '../../src';
import {expect} from 'chai';
import * as fs from "fs";
import * as JSZip from 'jszip';
import {extend} from 'lodash';

const { getBuildTemporaryPath } = require('../fixtures/utils');

// @ts-ignore
const getComponents = function() {
  const workbook = new Workbook();
  const topic = new Topic({sheet: workbook.createSheet('sheet1', 'centralTopic')});
  const zip = new Zipper({path: getBuildTemporaryPath(), workbook});
  const marker = new Marker();
  return {topic, workbook, zip, marker };
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

  it('should be failed to add topic with non string title', done => {
    const {topic} = getComponents();
    try {
      topic.on().add();
    } catch (e) {
      expect(e.message).to.be.eq('topic.title should be a valid string');
      done();
    }
  });

  it('should be able to add topic with empty title', done => {
    const {topic} = getComponents();

    topic.on().add({ title: '' });

    const topics = topic.cids();
    expect(topics).to.have.property(topic.cid(''));
    expect(topics).to.have.property(topic.cid('Central Topic'));
    expect(topics).to.have.property(topic.rootTopicId);
    done();
  });

  it('should be failed if call .on() with an invalid componentId', done => {
    try {
      const {topic} = getComponents();
      // @ts-ignore
      topic.on({});
    } catch (e) {
      expect(e).to.be.an('error');
      done();
    }
  });

  it('should be failed to add a topic with an invalid componentId', done => {
    const doesNotExists = 'componentId does not exist';
    try {
      const {topic} = getComponents();
      topic
        .on()
        .add({title: 'main topic 1'})
        .on(doesNotExists);
    } catch (e) {
      expect(e.message).to.be.eq(`Invalid componentId ${doesNotExists}`);
      done();
    }
  });

  it('should be failed to destroy topic with invalid title', done => {
    const {topic, zip} = getComponents();
    topic
      .add({title: '1'})
      .add({title: '2'})
      .destroy('22');

    // @ts-ignore
    topic.destroy();

    zip.save().then(async status => {
      expect(status).to.be.true;
      const p = getBuildTemporaryPath('default.xmind');
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

  it('should return all the topics that has been stored on the data set', done => {
    const {topic} = getComponents();

    topic
      .add({title: '1'})
      .add({title: '2'});

    const topics = topic.cids();
    expect(topics).to.have.property(topic.cid('1'));
    expect(topics).to.have.property(topic.cid('2'));
    expect(topics).to.have.property(topic.cid('Central Topic'));
    expect(topics).to.have.property(topic.rootTopicId);
    done();
  });

  it('should be .find(componentId?) worked with a componentId', done => {
    const {topic} = getComponents();
    const component = topic.find(topic.rootTopicId) || null;
    expect(component).to.be.not.null;
    done();
  });

  it('should return a component of root topic by .find(componentId?) if does not given topicId', done => {
    const {topic} = getComponents();
    const component = topic.find() || null;
    expect(component).to.be.not.null;
    done();
  });

  it('the component of summary should be created if does not given options', done => {
    const {topic, zip, marker } = getComponents();
    topic.add({title: 'Programming Language'})
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
      .add({title: '中文测试'})
      .add({title: 'にほんご／にっぽんご'})
      .add({title: 'mixed123中文ぽんご😋'})
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
      .summary({title: 'all of the productions are belonging to jetbrains'})

      .on(topic.cid('Microsoft'))
      .marker(marker.smiley('cry'))
      .add({title: 'vs code'});

    zip.save().then(status => {
      status && done()
      console.info('==========', zip.target())
    });
  });

  it('should return the central topic id if never to add component', done => {
    const {topic} = getComponents();

    const id = topic.cid();
    expect(id).to.eq(topic.rootTopic.getId());
    expect(id).to.eq(topic.rootTopicId);
    done();
  });

  it('should be marker removed', done => {
    const {topic} = getComponents();
    const marker = new Marker();
    const cry = marker.smiley('cry');
    topic
      .add({title: 'main topic 1'})
      .marker(cry)
      // del
      .marker(extend({}, cry, {del: true}));

    done();
  });

  it('should return the componentId accurately, if the titles are duplicated', done => {
    const { topic } = getComponents();
    topic.add({ title: 'main topic - 1', customId: 1 });
    const a1 = topic.cid();
    topic.add({ title: 'main topic - 1', customId: 2 })
    const a2 = topic.cid();
    expect(topic.cid('main topic - 1', { customId: 1 })).to.eq(a1);
    expect(topic.cid('main topic - 1', { customId: 2 })).to.eq(a2);

    topic.on(a2).add({title: 'abc'});
    const abc1 = topic.cid();
    topic.add({ title: 'bca' });
    topic.on(a1).add({title: 'abc' });
    const abc2 = topic.cid();


    expect(topic.cid('abc', { parentId: a2})).to.eq(abc1);
    expect(topic.cid('abc', { parentId: a1})).to.eq(abc2);

    topic.add({ title: 'main topic - 1', customId: 3 });
    const a3 = topic.cid();
    topic.add({ title: 'main topic - 1', customId: 4 });
    const a4 = topic.cid();
    expect(topic.cid('main topic - 1', { customId: 3 })).to.eq(a3);
    expect(topic.cid('main topic - 1', { customId: 4 })).to.eq(a4);

    topic.on(a4).add({title: ''});
    const emptyString1 = topic.cid();
    topic.on(a3).add({title: ''});
    const emptyString2 = topic.cid();

    expect(topic.cid('', { parentId: a4 })).to.eq(emptyString1);
    expect(topic.cid('', { parentId: a3 })).to.eq(emptyString2);

    topic.destroy(topic.cid('abc', { parentId: a1}));
    topic.destroy(topic.cid('abc', { parentId: a2}));

    expect(topic.cid('abc', { parentId: a1})).to.eq(null);
    expect(topic.cid('abc', { parentId: a2})).to.eq(null);

    topic.destroy(topic.cid('', { parentId: a3}));
    topic.destroy(topic.cid('', { parentId: a4}));

    expect(topic.cid('', { parentId: a4})).to.eq(null);
    expect(topic.cid('', { parentId: a3})).to.eq(null);
    done();
  });
});
