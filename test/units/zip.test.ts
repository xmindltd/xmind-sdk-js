import { expect } from 'chai';
import { join } from 'path';
import * as fs from 'fs';
import {getBuildTemporaryPath} from '../fixtures/utils';

const {Zipper} = require('../../src');

describe('# Zip Unit Test', () => {
  it('should return error if path does not specified', done => {
    const options = {path: '', filename: 'test'};
    try { new Zipper(options) } catch (e) {
      expect(e).to.be.an('error');
      expect(e.message).to.eq('the `path` is required or must exists');
      done();
    }
  });

  it('should test.xmind to be saved', async () => {
    const options = {path: getBuildTemporaryPath(), filename: 'test'};
    const zipper = new Zipper(options);
    const content: { id: string; title: string } = { id: '1231231313', title: 'sheet1' };
    zipper.addJSONContent(content);
    await zipper.save();
    const p = join(options.path, options.filename + '.xmind');
    expect(fs.existsSync(p)).be.eq(true);
    fs.unlinkSync(p);
    return null;
  });
});
