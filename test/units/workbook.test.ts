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
      expect(e.message).to.be.eq('The title of sheet is duplication');
      done();
    }
  });

  it('should call .loadSheets() error', done => {
    const workbook = new Workbook();
    try {
      // @ts-ignore
      workbook.loadSheets();
    } catch (e) {
      expect(e).to.be.an('error');
    }

    try {
      workbook.loadSheets([]);
    } catch (e) {
      expect(e).to.be.an('error');
    }

    done();
  });

});
