import { isEmpty, isObject } from '../../src/utils/common';
import { expect } from 'chai';


describe('# Common Utils Test', function() {

  it('isEmpty(), should return true if given null', done => {
    expect(isEmpty(null)).to.be.true;
    done();
  });

  it('isEmpty(), should return true if given undefined', done => {
    expect(isEmpty(undefined)).to.be.true;
    done();
  });

  it('isEmpty(), should return true if given ""', done => {
    expect(isEmpty('')).to.be.true;
    done();
  });

  it('isEmpty(), should return true if given [] || {}', done => {
    expect(isEmpty({})).to.be.true;
    expect(isEmpty({})).to.be.true;
    done();
  });

  it('isEmpty(), should return false if given false || 0 || "123"', done => {
    expect(isEmpty(false)).to.be.false;
    expect(isEmpty(0)).to.be.false;
    expect(isEmpty('123')).to.be.false;
    done();
  });


  it('isEmpty(), should return false if given [1, 2, 3] || {a: 1}', done => {
    expect(isEmpty([1, 2, 3])).to.be.false;
    expect(isEmpty({a: 1})).to.be.false;
    done();
  });


  it('isObject(), should return false if given 0 || "" || null || undefined', done => {
    expect(isObject(0)).to.be.false;
    expect(isObject('')).to.be.false;
    expect(isObject(null)).to.be.false;
    expect(isObject(undefined)).to.be.false;
    done();
  });

  it('isObject(), should return true if given {} || [] || Function', done => {
    expect(isObject({})).to.be.true;
    expect(isObject([])).to.be.true;
    expect(isObject(() => {})).to.be.true;
    done();
  });
});
