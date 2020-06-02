import {
  AbstractLoader,
  LoaderTypedOptions
} from '../abstracts/loader.abstract';
import { Workbook } from './workbook';

import * as Core from 'xmind-model';
import * as JSZip from 'jszip';

const from = require('../snowbrush').fromXMind;

/**
 * @implements AbstractLoader
 * @constructor
 * @param {LoaderTypedOptions} options
 *  {JSZip} options.ctx - The .xmind file that should be unzipped by JSZip
 */
export class Loader implements AbstractLoader {
  protected data;
  protected loaded = false;
  protected workbook: Workbook;

  constructor(protected options: LoaderTypedOptions) {
    if (!options.ctx || !(options.ctx instanceof JSZip)) {
      throw new Error('ctx must be a valid type of JSZip');
    }

    this.options = options;
  }

  public async loadSheets(): Promise<Core.Sheet[]> {
    if (!this.loaded) {
      await this.normalize();
    }
    this.workbook = new Workbook();
    const { sheets } = this.data;
    return this.workbook.loadSheets(sheets);
  }

  public getWorkbook(): Workbook {
    if (!this.loaded) {
      throw new Error('should call .loadSheets first');
    }
    return this.workbook;
  }

  /**
   * @private
   * @description Normalizing zip file
   */
  private async normalize() {
    this.data = await from(this.options.ctx);
    this.loaded = true;
  }
}