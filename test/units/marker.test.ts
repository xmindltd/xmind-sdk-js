import { Marker } from '../../src';
import { expect } from 'chai';

const marker = new Marker();

const groups = [
  'other', 'half', 'week',
  'month', 'symbol', 'arrow',
  'people', 'star', 'flag',
  'task', 'priority', 'smiley'
];

describe('# Marker Unit Test', () => {
  it('should be found groups on instance of Marker', done => {
    for (const grp of groups) {
      expect(marker).to.have.property(grp).that.to.be.an('function');
    }
    done();
  });

  it('should return an object that contains groupId & markerId', done => {
    expect(marker.smiley('cry')).to.have.property('groupId');
    expect(marker.smiley('cry')).to.have.property('markerId');
    done();
  });

  it('should return null if name is empty', done => {
    expect(marker.smiley('')).to.be.null;
    done();
  });

  it('should return null if name does not exists', done => {
    // @ts-ignore
    expect(marker.smiley('does not exists name')).to.be.null;
    done();
  });

  it('should return an object if name is a valid number for group priority', done => {
    // @ts-ignore
    expect(marker.priority(1)).to.have.property('groupId');
    // @ts-ignore
    expect(marker.priority(2)).to.have.property('markerId');
    done();
  });

  it('should return an array of group names', done => {
    expect(Marker.groups()).to.be.an('array');
    expect(Marker.groups().length).to.greaterThan(0);
    done();
  });

  it('should find out an array of names', done => {
    const groups = Marker.groups();
    expect(Marker.names(groups[0])).to.be.an('array');
    expect(Marker.names(groups[0]).length).to.greaterThan(0);
    expect(Marker.names(null)).to.be.undefined;
    expect(Marker.names('{}')).to.be.undefined;
    expect(Marker.names(undefined)).to.be.undefined;
    // @ts-ignore
    expect(Marker.names(new Object())).to.be.undefined;
    done();
  });
});
