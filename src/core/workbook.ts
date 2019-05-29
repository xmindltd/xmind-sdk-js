import { Sheet } from '../core/sheet';
import { platform } from 'os';
import Zipper from '../utils/zipper';


export interface WorkbookOptions {
  path: string;
  workbook?: any;
}

/**
 * @description Main class
 * @param {WorkbookOptions} - options
 * @param {String} options.path is required upon the win32 system
 * @extends {Sheet}
 */
export class Workbook extends Sheet {
  public zipper: Zipper;

  constructor(options: WorkbookOptions = <WorkbookOptions>{}) {
    super(options);
    if (platform() === 'win32' && !options.path) {
      throw new Error('You must specify a temporary folder on win32 system.');
    } else {
      options.path = '/tmp';
    }
    options.workbook = this;
    this.zipper = new Zipper(options);
  }

  /**
   * @description Formatting Mind-map data as String
   * @return {String}
   */
  public toString() {
    return this.workbook.toString();
  }

  /**
   * @description Formatting Mind-map data as JSON
   * @return {Object}
   */
  public toJSON() {
    return this.workbook.toJSON();
  }
}
