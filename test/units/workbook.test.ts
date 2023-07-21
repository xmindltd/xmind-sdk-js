import { Workbook } from '../../src';
import { expect } from 'chai';

describe('# Workbook Unit Test', () => {

  it('should be workbook created', () => {
    const workbook1 = new Workbook();
    expect(workbook1 instanceof Workbook).to.be.true;
  });

  it('should be workbook created on darwin/linux system', () => {
    const workbook1 = new Workbook();
    expect(workbook1 instanceof Workbook).to.be.true;
  });

  it('should set theme to be failed if given an invalid theme name', done => {
    const workbook = new Workbook();
    workbook.createSheet('sheet-1');
    const ret = workbook.theme('sheet-1', 'robust');
    expect(ret).to.be.true;
    done();
  });

  it('should be failed if sheet title as empty', done => {
    try {
      const workbook = new Workbook();
      // @ts-ignore
      workbook.createSheet();
    } catch (e) {
      expect(e.message).to.be.eq('The title of sheet is required');
      done();
    }
  });

  it('should be failed if given a title of the sheet of duplication', done => {
    try {
      const workbook = new Workbook();
      workbook.createSheet('sheet-1');
      workbook.createSheet('sheet-1');
    } catch (e) {
      expect(e.message).to.be.eq('You are trying to create the sheet repeatedly that is not allowed');
      done();
    }
  });


  it('should be an error throwing out if getSheet with a wrong sheetId', done => {
    const workbook = new Workbook();
    try {
      // @ts-ignore
      workbook.createSheets();
    } catch (err) {
      expect(err instanceof Error).to.be.true;
    }

    workbook.createSheets([
      {s: 'sheetTitle_1', t: 'topicTitle_1'},
      {s: 'sheetTitle_2', t: 'topicTitle_2'}
    ]);

    try {
      // @ts-ignore Trust me Typescript
      workbook.getSheet();
    } catch (err) {
      expect(err instanceof Error).to.be.true;
    }

    const sheets = workbook.getSheets();
    const sheet = workbook.getSheet(sheets[0].id);
    expect(sheet).to.be.an('object');
    done();
  });

  it('should be success to create multiple sheets', done => {
    const workbook = new Workbook();
    workbook.createSheets([
      {s: 'sheetTitle_1', t: 'topicTitle_1'},
      {s: 'sheetTitle_2', t: 'topicTitle_2'}
    ]);
    const sheets = workbook.getSheets();
    expect(sheets.length).to.eq(2);
    done();
  });

  it('should use a loader', done => {
    const workbook = new Workbook();
    // const loader = new Loader();
    workbook.createSheets([
      {s: 'sheetTitle_1', t: 'topicTitle_1'},
      {s: 'sheetTitle_2', t: 'topicTitle_2'}
    ]);
    const sheets = workbook.getSheets();
    expect(sheets.length).to.eq(2);
    done();
  });

});
