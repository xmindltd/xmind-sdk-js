import { Workbook, Topic, Marker, Zipper } from '../../src';
import * as chai from 'chai';
import * as fs from 'fs';
import * as _path from 'path';
import * as JSZip from 'jszip';
// @ts-ignore
import { getBuildTemporaryPath } from '../fixtures/utils';
import Core = require('xmind-model');
import { join } from 'path';
import Loader from '../../src/core/loader';


const expect = chai.expect;


const getComponents = function() {
  const workbook = new Workbook();
  const sheet = workbook.createSheet('sheet1', 'centralTopic');
  const topic = new Topic({sheet});
  const zip = new Zipper({path: getBuildTemporaryPath(), workbook});
  return {topic, workbook, sheet, zip};
};


describe('# Functional Test', () => {
  describe('# Entries', () => {
    it('the sheet should be created and has rootTopic', done => {
      const workbook = new Workbook();
      const sheet = workbook.createSheet('sheet1');
      expect(sheet instanceof Core.Sheet).to.be.true;
      expect(sheet.getRootTopic()).to.be.not.null;
      done();
    });

    it('the topic should be created and has .on .add etc. ', done => {
      const workbook = new Workbook();
      const sheet = workbook.createSheet('sheet1');
      const topic = new Topic({sheet});
      expect(topic instanceof Topic).to.be.true;
      expect(topic).to.have.property('on');
      expect(topic).to.have.property('add');
      expect(topic).to.have.property('note');
      done();
    });
  });

  describe('# Topic', () => {
    it('should be a lots of main topic added to rootTopic', done => {
      const topics = ['main topic 1', 'main topic 2', 'main topic 3', 'main topic 4'];
      const {workbook, topic} = getComponents();
      topic.add({title: 'main topic 1'})
        .add({title: 'main topic 2'})
        .add({title: 'main topic 3'})
        .add({title: 'main topic 4'});

      const children = workbook.toJSON()[0].rootTopic.children.attached;
      for (let i = 0; i < children.length; i++) {
        expect(children[i]).to.have.property('title');
        expect(children[i]).to.have.property('id');
        expect(topics).to.include(children[i].title);
      }
      done();
    });

    it('should be subtopic added on main topic 1', done => {
      const {workbook, topic} = getComponents();
      topic.add({title: 'main topic 1'});

      const children = workbook.toJSON()[0].rootTopic.children.attached;
      expect(children[0]).to.have.property('title').that.to.be.eq('main topic 1');
      expect(children[0]).to.have.property('id');

      topic
        .on(topic.cid())
        .add({title: 'subtopic 1'})
        .add({title: 'subtopic 2'})
        .add({title: 'subtopic 3'});

      const subtopics = workbook.toJSON()[0].rootTopic.children.attached[0].children.attached;
      for(let i = 0; i < subtopics.length; i++) {
        expect(subtopics[i].title.startsWith('subtopic')).to.be.true;
        expect(subtopics[i].id).to.not.be.empty;
      }
      done();
    });

    it('should be subtopic removed', done => {
      const {workbook, topic} = getComponents();
      topic.add({title: 'main topic 1'});

      const children = workbook.toJSON()[0].rootTopic.children.attached;
      expect(children[0]).to.have.property('title').that.to.be.eq('main topic 1');
      expect(children[0]).to.have.property('id');

      topic
        .on(topic.cid())
        .add({title: 'subtopic 1'})
        .add({title: 'subtopic 2'});
      const subTopic2Id = topic.cid();

      topic.add({title: 'subtopic 3'});
      topic.destroy(subTopic2Id);
      // Do nothing if you have to remove topic twice
      topic.destroy(subTopic2Id);

      const subtopics = workbook.toJSON()[0].rootTopic.children.attached[0].children.attached;
      expect(subtopics.length).to.be.eq(2);
      for(let i = 0; i < subtopics.length; i++) {
        expect(subtopics[i].title.startsWith('subtopic')).to.be.true;
        expect(subtopics[i].id).to.not.be.empty;
      }
      done();
    });

    it('should be topic found by componentId', done => {
      const {topic} = getComponents();
      topic.add({title: 'main topic 1'});
      const mainTopic1 = topic.find(topic.cid());
      expect(mainTopic1).to.not.be.empty;
      done();
    });

    it(`should be default.xmind file to save in ${getBuildTemporaryPath('default.xmind')}`, done => {
      const p = getBuildTemporaryPath('default.xmind');
      if (fs.existsSync(p)) {
        fs.unlinkSync(p);
      }

      const {topic, zip} = getComponents();
      topic
        .add({title: 'main topic 1'})
        .add({title: 'main topic 1111'})
        .add({title: 'main topic 222'})
        .add({title: 'main topic 11'});

      topic
        .on(topic.cid('main topic 1111'))
        .add({title: 'subtopic 1111'});

      topic
        .on(topic.cid('main topic 1'))
        .add({title: 'subtopic 1'});

      topic
        .on(topic.cid('main topic 222'))
        .note('add note to main topic 222')
        .add({title: 'subtopic 222 with a note'})
        .on(topic.cid('subtopic 222 with a note'))
        .note('this is the note with');

      zip.save().then((status) => {
        expect(status).to.be.true;
        expect(fs.existsSync(p)).to.be.true;
        fs.unlinkSync(p);
        done();
      });
    });

    it('should be a topic destroyed', done => {
      const {topic, zip} = getComponents();
      topic
        .add({title: 'main topic 1'})
        .add({title: 'main topic 2'})
        .add({title: 'main topic 3'});

      topic.destroy(topic.cid('main topic 2'));
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
          expect(attached.find(child => child.title === topic.cid('main topic 2'))).to.be.undefined;
          fs.unlinkSync(p);
          done();
        });
      });
    });


    it('should add image on topic', done => {
      const {topic, zip} = getComponents();
      topic
        .add({title: 'main topic 1'})
        .add({title: 'main topic 2'});

      const key1 = topic.on(topic.cid('main topic 1')).image();
      zip.updateManifestMetadata(key1, fs.readFileSync(join(__dirname, '../fixtures/19442.png')));
      const key2 = topic.on(topic.cid('main topic 2')).image();
      zip.updateManifestMetadata(key2, fs.readFileSync(join(__dirname, '../fixtures/logo.png')));
      zip.save().then(async status => {
        expect(status).to.be.true;
        const p = getBuildTemporaryPath('default.xmind');
        const content = fs.readFileSync(p);
        JSZip.loadAsync(content).then(async zip => {
          const text = await zip.file('content.json').async('text');
          const map = JSON.parse(text)[0];
          expect(map).to.be.an('object');
          const {attached} = map.rootTopic.children;
          expect(attached.length).to.gt(0);
          expect(attached[0].image.src).to.eq(`xap:${key2}`);
          expect(attached[1].image.src).to.eq(`xap:${key1}`);
          fs.unlinkSync(p);
          done();
        });
      });
    });

  });

  describe('# Note', () => {

    it('attach a text note to main topic 1', done => {
      const { topic, workbook} = getComponents();
      const title = 'main topic 1';
      const text = 'this is a text note';

      topic
        .add({title})
        .on(topic.cid(title))
        .note(text);

      const obj = workbook.toJSON()[0].rootTopic.children.attached[0];
      expect(obj).to.have.property('notes');
      expect(obj.notes.plain.content).to.eq(text);
      done();
    });

    it('detach a text note from main topic 1', done => {
      const { topic, workbook} = getComponents();
      const title = 'main topic 1';
      const text = 'this is a text note';

      topic
        .add({title})
        .on(topic.cid(title))
        .note(text);

      topic.note(null, true);
      const obj = workbook.toJSON()[0].rootTopic.children.attached[0];
      expect(obj).to.have.not.property('notes');
      done();
    });

  });

  describe('# Marker', () => {

    it('should be failed to add marker', done => {
      const {topic} = getComponents();
      const title = 'main topic 1';
      topic
        .add({title})
        .on(topic.cid()) // topic.cid === last add title or topic.cid(title)
        // @ts-ignore
        .marker({})
        // @ts-ignore
        .marker();
      done();
    });

    it('should add the one of smiley marker flag', done => {
      const {topic, zip} = getComponents();
      const marker = new Marker();
      const title = 'main topic 1';
      topic
        .add({title})
        .on(topic.cid(title))
        .marker(marker.smiley('cry'));
      zip.save().then(status => {
        expect(status).to.be.true;
        const p = getBuildTemporaryPath('default.xmind');
        const content = fs.readFileSync(p);
        JSZip.loadAsync(content).then(async zip => {
          const text = await zip.file('content.json').async('text');
          const map = JSON.parse(text)[0];
          expect(map).to.be.an('object');
          const {attached} = map.rootTopic.children
          expect(attached).to.be.an('array');
          expect(attached.find(child => child.title === title)).to.have.property('markers').that.to.be.an('array');
          fs.unlinkSync(p);
          done();
        });
      });
    });

    it('should be marker removed', done => {
      const {topic, workbook} = getComponents();
      const marker = new Marker();
      const title = 'main topic 1';
      const cry = 'smiley-cry';

      topic
        .on()
        .add({title})
        .on(topic.cid())
        .marker(marker.smiley('cry'))
        .marker(marker.week('fri'));

      // before destroy
      let ctx = workbook.toJSON();
      let main = ctx[0].rootTopic.children.attached[0];
      expect(main).to.have.property('markers').that.to.be.an('array');
      expect(main.markers.length).to.eq(2);

      // delete
      topic.marker(Object.assign({}, marker.smiley('cry'), {del: true}));

      // after destroy
      ctx = workbook.toJSON();
      main = ctx[0].rootTopic.children.attached[0];
      expect(main).to.have.property('markers');
      expect(main.markers.length).to.eq(1);
      expect(main.markers[0].markerId).to.not.eq(cry);
      done();
    });
  });

  describe('# Summary', () => {
    it('should be edge ignored if topic id does not exists', done => {
      const {topic, zip} = getComponents();

      topic
        .add({title: 'main topic 1'})
        .on(topic.cid())
        .add({title: 'subtopic 1'})
        .add({title: 'subtopic 2'})
        .summary({title: 'Test Summary', edge: 'does not exists'});

      zip.save().then(status => {
        expect(status).to.be.true;
        const p = getBuildTemporaryPath('default.xmind');
        const content = fs.readFileSync(p);
        JSZip.loadAsync(content).then(async zip => {
          const text = await zip.file('content.json').async('text');
          const map = JSON.parse(text)[0];
          expect(map).to.be.an('object');
          expect(map).to.have.property('rootTopic');
          expect(map.rootTopic).to.have.property('summaries');
          expect(map.rootTopic.summaries[0]).to.have.property('range').that.to.be.an('string');
          expect(map.rootTopic.summaries[0].range).to.eq('(0,0)');
          fs.unlinkSync(p);
          done();
        });
      });
    });

    it('should be a summary object added that contains 1 main topic and 2 subtopics', done => {
      const {topic, zip} = getComponents();

      topic
        .add({title: 'main topic 1'})
        .on(topic.cid())
        .add({title: 'subtopic 1'})
        .add({title: 'subtopic 2'})
        .summary({title: 'Test Summary'});

      zip.save().then(status => {
        expect(status).to.be.true;
        const p = getBuildTemporaryPath('default.xmind');
        const content = fs.readFileSync(p);
        JSZip.loadAsync(content).then(async zip => {
          const text = await zip.file('content.json').async('text');
          const map = JSON.parse(text)[0];
          expect(map).to.be.an('object');
          expect(map).to.have.property('rootTopic');
          expect(map.rootTopic).to.have.property('summaries');
          expect(map.rootTopic.summaries[0]).to.have.property('range').that.to.be.an('string');
          // contains 1 main topic
          // (0,0)
          // 1st: 0 - that's meaning where is the element start at children list
          // 2nd: 0 - that's meaning where is the element end at children list
          expect(map.rootTopic.summaries[0].range).to.eq('(0,0)');
          fs.unlinkSync(p);
          done();
        });
      });
    });


    it('should be a summary object added that contains 2 main topic and 3 subtopics', done => {
      const {topic, zip} = getComponents();

      topic
        .add({title: 'main topic 1'})
        .add({title: 'main topic 2'})
        .add({title: 'main topic 3'})
        .on(topic.cid('main topic 1'))
        .add({title: 'subtopic 1'})
        .add({title: 'subtopic 2'})
        .on(topic.cid('main topic 2'))
        .add({title: 'subtopic 1'})

        .on(topic.cid('main topic 1')) /* position topic title */
        .summary({title: 'Test Summary', edge: topic.cid('main topic 2')});

      zip.save().then(status => {
        expect(status).to.be.true;
        const p = getBuildTemporaryPath('default.xmind');
        const content = fs.readFileSync(p);
        JSZip.loadAsync(content).then(async zip => {
          const text = await zip.file('content.json').async('text');
          const map = JSON.parse(text)[0];
          expect(map).to.be.an('object');
          expect(map.rootTopic.summaries[0].range).to.eq('(0,1)');
          fs.unlinkSync(p);
          done();
        });
      });
    });

    it('only contains 1 main topic if given a invalid range topic name', done => {
      const {topic, zip} = getComponents();

      topic
        .add({title: 'main topic 1'})
        .add({title: 'main topic 2'})
        .add({title: 'main topic 3'})
        .on(topic.cid('main topic 1'))
        .add({title: 'subtopic 1'})
        .add({title: 'subtopic 2'})
        .on(topic.cid('main topic 2'))
        .add({title: 'subtopic 1'})

        .on(topic.cid('main topic 1')) /* position topic title */
        .summary({title: 'Test Summary', edge: topic.cid('main topic does not exists')});

      zip.save().then(status => {
        expect(status).to.be.true;
        const p = getBuildTemporaryPath('default.xmind');
        const content = fs.readFileSync(p);
        JSZip.loadAsync(content).then(async zip => {
          const text = await zip.file('content.json').async('text');
          const map = JSON.parse(text)[0];
          expect(map).to.be.an('object');
          expect(map.rootTopic.summaries[0].range).to.eq('(0,0)');
          fs.unlinkSync(p);
          done();
        });
      });
    });

    it('only contains start position if the index position (start > end)', done => {
      const {topic, zip, workbook} = getComponents();
      topic
        .add({title: 'main topic 1'})
        .add({title: 'main topic 2'})
        .add({title: 'main topic 3'})
        .on(topic.cid('main topic 1'))
        .add({title: 'subtopic 1'})
        .add({title: 'subtopic 2'})
        .on(topic.cid('main topic 2'))
        .add({title: 'subtopic 1'})

        .on(topic.cid('main topic 3')) /* position topic title */
        .summary({title: 'Test Summary', edge: topic.cid('main topic 1')});

      const {status, errors} = workbook.validate();
      if (!status) {
        throw errors;
      }

      zip.save().then(status => {
        expect(status).to.be.true;
        const p = getBuildTemporaryPath('default.xmind');
        const content = fs.readFileSync(p);
        JSZip.loadAsync(content).then(async zip => {
          const text = await zip.file('content.json').async('text');
          const map = JSON.parse(text)[0];
          expect(map).to.be.an('object');
          expect(map.rootTopic.summaries[0].range).to.eq('(2,2)');
          fs.unlinkSync(p);
          done();
        });
      });
    });
  });

  describe('# Theme Test', () => {
    it('authenticating theme data 100 times', done => {
      for (let i = 0; i < 100; i++) {
        const workbook = new Workbook();
        const sheet = workbook.createSheet('sheet1');
        const topic = new Topic({sheet});
        topic
          .on()
          .add({title: 'main topic 1'})
          .add({title: 'main topic 2'});

        workbook.theme('sheet1', 'snowbrush');
        const data = workbook.toJSON()[0];
        expect(data).to.have.property('theme');
        expect(data.theme.title).to.eq('snowbrush');
      }
      done();
    });

    it('authenticating theme 100 times after zip', async () => {
      for (let i = 0; i < 100; i++) {
        const workbook = new Workbook();
        const sheet = workbook.createSheet('sheet1');
        const topic = new Topic({sheet});
        const zip = new Zipper({workbook, path: getBuildTemporaryPath(), filename: `test_${i}`});
        topic
          .on()
          .add({title: 'main topic 1'})
          .add({title: 'main topic 2'});

        workbook.theme('sheet1', 'snowbrush');
        await zip.save();
        const file = join(getBuildTemporaryPath(), `test_${i}.xmind`);
        await JSZip.loadAsync(fs.readFileSync(file))
          .then(zip => {
            return zip.file(`content.json`).async('text')
          })
          .then(content => {
            const data = JSON.parse(content)[0];
            expect(data).to.have.property('theme');
            expect(data.theme.title).to.eq('snowbrush');
            fs.unlinkSync(file)
          })
          .catch(err => { throw err });
      }

      return null
    });
  });

  describe('# Loader Test', () => {

    it('loading failed if given an invalid zip file', done => {
      try {
        // @ts-ignore
        new Loader({ctx: 'Here, must be type of JSZip'})
      } catch (e) {
        expect(e.message).to.eq('ctx must be a valid type of JSZip');
        done();
      }
    });

    it('loading zip file and also, return sheets object', done => {
      const zip = _path.resolve(__dirname, '../fixtures/default.xmind');
      JSZip.loadAsync(fs.readFileSync(zip)).then(async unzipped => {
        const loader = new Loader({ctx: unzipped});
        const sheets = await loader.loadSheets();

        for (const key in sheets) {
          if (!sheets.hasOwnProperty(key)) continue;
          const topic = new Topic({sheet: sheets[key], isLoaded: true});
          const ids = topic.cids();
          expect(ids).to.be.an('object');
          expect(Object.keys(ids).length).to.gt(0);
        }
        done();
      }).catch(done);
    });

  });
});
