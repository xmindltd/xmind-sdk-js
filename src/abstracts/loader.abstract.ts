import * as JSZip from 'jszip';
import * as Core from 'xmind-model';
import { Workbook } from '..';

export interface LoaderTypedOptions {
  ctx: JSZip;
}

export interface AbstractLoader {

  /**
   * @description Loading sheets into workbook
   * @return {Promise<[]>}
   */
  loadSheets(): Promise<Core.Sheet[]>;

  /**
   * @description Getting workbook that is already created in step `loadSheets()`
   * @return {Workbook}
   */
  getWorkbook(): Workbook;
}