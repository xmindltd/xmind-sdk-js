import { expect } from 'chai';
import { Loader } from '../../src';
import * as _path from 'path';
import * as JSZip from 'jszip';
import * as fs from 'fs';
import { Workbook } from '../../src';


describe('# Loader Unit Test', function() {

  const zip = _path.resolve(__dirname, '../fixtures/default.xmind');

  it('should load failed if given an invalid zip file', done => {
    try {
      // @ts-ignore
      new Loader({ctx: 'Here, must be type of JSZip'})
    } catch (e) {
      expect(e.message).to.eq('ctx must be a valid type of JSZip');
      done();
    }
  });

  it('should get workbook error before calling .loadSheets()', done => {

    JSZip.loadAsync(fs.readFileSync(zip)).then(async unzipped => {
      const loader = new Loader({ctx: unzipped});
      // const sheets = await loader.loadSheets();
      try {
        loader.getWorkbook();
      } catch (e) {
        expect(e).to.be.an('error');
      }
      done();
    });
  });

  it('should get workbook instance and overwrite on top of workbook', done => {
    console.log("38")
    JSZip.loadAsync(fs.readFileSync(zip)).then(async unzipped => {
      const loader = new Loader({ctx: unzipped});
      await loader.loadSheets();
      console.log("42")
      const workbook = loader.getWorkbook();
      expect(workbook instanceof Workbook).to.be.true;

      await loader.loadSheets();
      console.log("47")
      expect(loader.getWorkbook()).to.not.eql(workbook);
      done();
    });
  });

});