import { Workbook } from '../../src';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as os from 'os';

describe('# Workbook Unit Test', () => {

  it('should be failed if does not given a tmp path on win32 system', () => {
    sinon.stub(os, 'platform').callsFake(() => 'win32');
    try {
      new Workbook();
    } catch (e) {
      expect(e.message).to.be.eq('You must specify a temporary folder on win32 system.');
      sinon.restore();
    }
  });

  it('should be workbook created on win32 system', () => {
    sinon.stub(os, 'platform').callsFake(() => 'win32');
    const workbook = new Workbook({path: 'C:\\\\tmp'});
    expect(workbook instanceof Workbook).to.be.true;
    sinon.restore();
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
