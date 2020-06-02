import { LoaderTypedOptions } from '../abstracts/loader.abstract';
import { Workbook } from './workbook';

import * as Core from 'xmind-model';
import * as JSZip from 'jszip';

const from = require('../snowbrush').fromXMind;


class Loader {
  protected data;
  protected loaded = false;
  public workbook;

  constructor(protected options: LoaderTypedOptions) {
    if (!options.ctx || !(options.ctx instanceof JSZip)) {
      throw new Error('ctx must be a valid type of JSZip');
    }

    this.options = options;
  }

  /**
   * @public
   * @description Loading sheets
   * @return {Promise<[]>}
   */
  public async loadSheets(): Promise<Core.Sheet[]> {
    if (!this.loaded) {
      await this.loadUp();
    }
    this.workbook = new Workbook();
    const { sheets } = this.data;
    return this.workbook.loadSheets(sheets);
  }

  /**
   * @private
   * @description Loading zip file
   */
  private async loadUp() {
    this.data = await from(this.options.ctx);
    this.loaded = true;
  }
}

export default Loader;