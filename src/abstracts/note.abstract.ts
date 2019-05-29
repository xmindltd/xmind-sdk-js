import * as Model from '../common/model';

/**
 * @description Note abstract
 */
export interface AbstractNote {
  /**
   * @description Formatting content as JSON
   * @return {Object}
   */
  toJSON(): Model.Notes;

  /**
   * @description Formatting content as String
   * @return {String}
   */
  toString(): string;
}
