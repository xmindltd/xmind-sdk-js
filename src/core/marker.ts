import { AbstractMarker } from '../abstracts/marker.abstract';
import icons = require('../common/constants/marker');
import Debug from 'debug';

const debug = Debug('xmind-sdk:marker');

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
}
