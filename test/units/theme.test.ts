import { Theme } from '../../src/core/theme';
import { expect } from 'chai';


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
    expect(data.title).to.be.eq('robust');
    done();
  });

  it('should return the snowbrush theme object', done => {
    const theme = new Theme({themeName: 'snowbrush'});
    const data = theme.data;
    expect(data.title).to.eq('snowbrush');
    done();
  });

  it('should return the business theme object', done => {
    const theme = new Theme({themeName: 'business'});
    const data = theme.data;
    expect(data.title).to.be.eq('business');
    done();
  });
});
