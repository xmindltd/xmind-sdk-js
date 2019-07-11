import { isEmpty, isObject } from '../../src/utils/common';
import { expect } from 'chai';


describe('# Common Utils Test', function() {

  it('isEmpty(), should return true if given null', done => {
    expect(isEmpty(null)).to.eq(true);
    done();
  });

  it('isEmpty(), should return true if given undefined', done => {
    expect(isEmpty(undefined)).to.eq(true);
    done();
  });

  it('isEmpty(), should return true if given ""', done => {
    expect(isEmpty('')).to.eq(true);
    done();
  });

  it('isEmpty(), should return true if given [] || {}', done => {
    expect(isEmpty({})).to.eq(true);
    expect(isEmpty({})).to.eq(true);
    done();
  });

  it('isEmpty(), should return false if given false || 0 || "123"', done => {
    expect(isEmpty(false)).to.eq(false);
    expect(isEmpty(0)).to.eq(false);
    expect(isEmpty('123')).to.eq(false);
    done();
  });


  it('isEmpty(), should return false if given [1, 2, 3] || {a: 1}', done => {
    expect(isEmpty([1, 2, 3])).to.eq(false);
    expect(isEmpty({a: 1})).to.eq(false);
    done();
  });


  it('isObject(), should return false if given 0 || "" || null || undefined', done => {
    expect(isObject(0)).to.eq(false);
    expect(isObject('')).to.eq(false);
    expect(isObject(null)).to.eq(false);
    expect(isObject(undefined)).to.eq(false);
    done();
  });

  it('isObject(), should return true if given {} || [] || Function', done => {
    expect(isObject({})).to.eq(true);
    expect(isObject([])).to.eq(true);
    expect(isObject(() => {})).to.eq(true);
    done();
  });
});
