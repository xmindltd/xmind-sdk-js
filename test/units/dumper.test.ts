import { Workbook } from '../../src';
import { Dumper } from '../../src/utils/dumper';
import { expect } from 'chai';

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
