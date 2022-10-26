const v4 = require('uuid/v4');
const Debug = require('debug');

export interface BaseOptions {
  debug?: string;
  instance?: any;
}

const DEFAULT_DEBUG_SCOPE = 'xmind-sdk';

export default class Base {
  private readonly _debug;

  /* istanbul ignore next */
  constructor(protected options: BaseOptions = <BaseOptions>{}) {
    this.options = options;
    this._debug = Debug(this.options.debug || DEFAULT_DEBUG_SCOPE);
  }

  /**
   * @description Print debug information
   * @param {Array} args - the rest arguments
   */
  public debug(...args) {
    this._debug(...args);
  }

  /**
   * @description uuid/v4
   */
  get id(): string {
    return v4();
  }
}
