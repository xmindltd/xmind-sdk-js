export interface Marker {
  groupId: string;
  markerId: string;
}

/**
 * @description Marker abstract class
 * should to override all the methods
 */
export class AbstractMarker {
  /**
   * @description The icon of group `priority`
   * @param {String} name
   * @return {Marker}
   */
  priority(name: string): Marker { return null; }

  /**
   * @description The icon of group `smiley`
   * @param {String} name
   * @return {Marker}
   */
  smiley(name: string): Marker { return null; }

  /**
   * @description The icon of group `task`
   * @param {String} name
   * @return {Marker}
   */
  task(name: string): Marker { return null; }

  /**
   * @description The icon of group `flag`
   * @param {String} name
   * @return {Marker}
   */
  flag(name: string): Marker { return null; }

  /**
   * @description The icon of group `star`
   * @param {String} name
   * @return {Marker}
   */
  star(name: string): Marker { return null; }

  /**
   * @description The icon of group `people`
   * @param {String} name
   * @return {Marker}
   */
  people(name: string): Marker { return null; }

  /**
   * @description The icon of group `arrow`
   * @param {String} name
   * @return {Marker}
   */
  arrow(name: string): Marker { return null; }

  /**
   * @description The icon of group `symbol`
   * @param {String} name
   * @return {Marker}
   */
  symbol(name: string): Marker { return null; }

  /**
   * @description The icon of group `month`
   * @param {String} name
   * @return {Marker}
   */
  month(name: string): Marker { return null; }

  /**
   * @description The icon of group `week`
   * @param {String} name
   * @return {Marker}
   */
  week(name: string): Marker { return null; }

  /**
   * @description The icon of group `half`
   * @param {String} name
   * @return {Marker}
   */
  half(name: string): Marker { return null; }

  /**
   * @description The icon of group `other`
   * @param {String} name
   * @return {Marker}
   */
  other(name: string): Marker { return null; }
}
