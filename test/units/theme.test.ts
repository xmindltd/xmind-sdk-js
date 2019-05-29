import { Theme } from '../../src/core/theme';
import { expect } from 'chai';
import { join } from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';


describe('# Theme Unit Test', () => {
  it('should have an error if does given nothing to Theme', done => {
    try {
      new Theme();
    } catch (e) {
      expect(e).to.be.an('error');
      done();
    }
  });

  it('should return the robust theme object', done => {
    const theme = new Theme({themeName: 'robust'});
    const data = theme.data;
    delete data.id;
    delete data.title;
    const a = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    const robust = join(__dirname, '../../src/common/themes/robust.json');
    const str = JSON.stringify(JSON.parse(fs.readFileSync(robust, {encoding: 'utf8'})));
    const b = crypto.createHash('md5').update(str).digest('hex');
    expect(a).to.be.eq(b);
    done();
  });

  it('should return the snowbrush theme object', done => {
    const theme = new Theme({themeName: 'snowbrush'});
    const data = theme.data;
    delete data.id;
    delete data.title;
    const a = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    const robust = join(__dirname, '../../src/common/themes/snowbrush.json');
    const str = JSON.stringify(JSON.parse(fs.readFileSync(robust, {encoding: 'utf8'})));
    const b = crypto.createHash('md5').update(str).digest('hex');
    expect(a).to.be.eq(b);
    done();
  });

  it('should return the business theme object', done => {
    const theme = new Theme({themeName: 'business'});
    const data = theme.data;
    delete data.id;
    delete data.title;
    const a = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    const robust = join(__dirname, '../../src/common/themes/business.json');
    const str = JSON.stringify(JSON.parse(fs.readFileSync(robust, {encoding: 'utf8'})));
    const b = crypto.createHash('md5').update(str).digest('hex');
    expect(a).to.be.eq(b);
    done();
  });
});
