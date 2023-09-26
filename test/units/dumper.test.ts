import { Topic, Workbook } from '../../src';
import { Dumper } from '../../src/utils/dumper';
import { expect } from 'chai';

const unreachable = () => { throw new Error('unreachable'); };

describe('# Dumper Unit Test', () => {

  it('should be failed to create dumper if does not given the instance of workbook', done => {
    try {
      // @ts-ignore
      new Dumper();
    } catch (e) {
      expect(e).to.be.an('error');
      expect(e.message).to.eq('The instance of workbook is required');
      done();
    }
  });

  it('should be able to update manifest', done => {
    const workbook = new Workbook();
    const sheet = workbook.createSheet('s1','r1');
    const topic = new Topic({ sheet });
    const imageKey1 = topic.image();
    const imageKey2 = topic.image();
    const dumper = new Dumper({workbook});

    const mockImageData1 = new Uint8Array();
    dumper.updateManifestMetadata(imageKey1, mockImageData1, {
      file(name, content) {
        expect(name).to.be.a('string');
        expect(content).to.be.an('Uint8Array');
        return Promise.resolve();
      },
      folder(name) {
        expect(name).to.be.a('string');
        return Promise.resolve();
      }
    })
    .then(() => (
      dumper.updateManifestMetadata(imageKey2, mockImageData1, {
        file(name, content) {
          expect(name).to.be.a('string');
          expect(content).to.be.an('Uint8Array');
          return Promise.resolve();
        },
        folder(name) {
          expect(name).to.be.a('string');
          return Promise.resolve();
        }
      })
    ))
    .then(() => {
      const files = dumper.dumping();
      expect(files).to.be.an('array');
      expect(files.length).to.eq(4);
      for (const obj of files) {
        expect(obj).to.have.property('filename');
        expect(obj).to.have.property('value').that.to.be.an('string');
      }
      const parsedManifest = JSON.parse(dumper.manifest.value)
      expect(parsedManifest['file-entries']).to.have.ownProperty(imageKey1)
      expect(parsedManifest['file-entries']).to.have.ownProperty(imageKey2)
      done();
    });
  });

  it('should fail if the key is empty when updating manifest', done => {
    const workbook = new Workbook();
    workbook.createSheet('s1','r1');
    const invalidKey = '';
    const dumper = new Dumper({workbook});

    const mockImageData = new Uint8Array();
    dumper.updateManifestMetadata(invalidKey, mockImageData, {
      file(name, content) {
        return unreachable();
      },
      folder(name) {
        return unreachable();
      }
    })
    .then(() => {
      return unreachable();
    })
    .catch((e) => {
      expect(e).to.be.an('error').with.property('message').include('key')
      done()
    })
  });

  it('should fail if creator failed to create file when updating manifest', done => {
    const workbook = new Workbook();
    const sheet = workbook.createSheet('s1','r1');
    const topic = new Topic({ sheet })
    const imageKey = topic.image()
    const dumper = new Dumper({workbook});

    const mockImageData = new Uint8Array();
    dumper
      .updateManifestMetadata(imageKey, mockImageData, {
        file(name, content) {
          return unreachable();
        },
        folder(name) {
          throw new Error("create folder failed");
        },
      })
      .then(() => {
        return unreachable();
      })
      .catch((e) => {
        expect(e).to.be.an("error").with.property("message").include("folder");
      })
      .then(() =>
        dumper.updateManifestMetadata(imageKey, mockImageData, {
          file(name, content) {
            throw new Error("create file failed");
          },
          folder(name) {
            expect(name).to.be.a("string");
            return Promise.resolve();
          },
        })
      )
      .then(() => {
        return unreachable();
      })
      .catch((e) => {
        expect(e).to.be.an("error").with.property("message").include("file");
        done();
      });
  });

  it('should dumping an array object that contains 4 files', done => {
    const workbook = new Workbook();
    workbook.createSheet('s1','r1');
    const dumper = new Dumper({workbook});
    const files = dumper.dumping();
    expect(files).to.be.an('array');
    expect(files.length).to.eq(4);
    for (const obj of files) {
      expect(obj).to.have.property('filename');
      expect(obj).to.have.property('value').that.to.be.an('string');
    }
    done();
  });

});
