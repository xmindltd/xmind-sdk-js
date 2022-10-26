import { AbstractMarker } from '../abstracts/marker.abstract';
import { icons, iterable } from '../common/constants/marker';

const debug = require('debug')('xmind-sdk:marker');

Object.defineProperty(icons, 'iterable', {
  value: iterable,
  enumerable: false,
  configurable: false,
  writable: false
});


export class Marker extends AbstractMarker {
  constructor() {
    super();
    this.init();
  }

  private init() {
    for (const property in icons) {
      this[property] = function(name: string) {
        if (!name) {
          return null;
        }
        const normalized = (typeof name === 'string') ? name : String(name);
        if (name && !icons[property].hasOwnProperty(normalized)) {
          debug('W - Invalid name string %s', name);
          return null;
        }
        return icons[property][normalized];
      };
    }
  }

  /**
   * @description Get names by group name
   * @param {String} groupName
   * @return {Array<string>}
   * @static
   */
  static names(groupName: string) {
    return icons['iterable'][String(groupName)];
  }

  /**
   * @description Get group names
   * @return {Array<string>}
   * @static
   */
  static groups() {
    return Object.keys(icons['iterable']);
  }
}