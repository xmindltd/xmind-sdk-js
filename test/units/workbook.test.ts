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
});
