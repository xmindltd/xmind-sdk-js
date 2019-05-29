import * as v4 from 'uuid/v4';
import * as Debug from 'debug';

export interface BaseOptions {
  debug?: string;
  instance?: any;
}

const DEFAULT_DEBUG_SCOPE = 'xmind-sdk';

export default class Base {
  private readonly d;

  /* istanbul ignore next */
  constructor(protected options: BaseOptions = <BaseOptions>{}) {
    this.options = options;
    this.d = Debug(this.options.debug || DEFAULT_DEBUG_SCOPE);
  }

  /**
   * @description Print debug information
   * @param {Array} args - the rest arguments
   */
  public debug(...args) {
    this.d(...args);
  }

  /**
   * @description uuid/v4
   */
  get id() {
    return v4();
  }
}
