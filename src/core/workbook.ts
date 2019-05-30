import { AbstractZipper as ZipperType } from '../abstracts/zipper';
import { AbstractWorkbook } from '../abstracts/workbook.abstract';
import { Theme } from './theme';
import Base from './base';
import Core = require('xmind-model');


/**
 * @description The implementation of Workbook
 * @extends {Base}
 */
export class Workbook extends Base implements AbstractWorkbook {
  public zipper: ZipperType;
  public sheet: Core.Sheet;
  private workbook: Core.Workbook;
  private readonly resources;


  constructor() {
    super();
    this.resources = {};
    this.zipper = null;
    if (typeof process === 'object') {
      const Zipper = require('../utils/zipper');
      const zipperOptions = {path: '/tmp', workbook: this};
      this.zipper = new Zipper(zipperOptions);
    }
  }


  public theme(sheetTitle:string, themeName: string) {
    /* istanbul ignore next */
    if (!sheetTitle || !this.resources[sheetTitle]) {
      return false;
    }
    /* istanbul ignore next */
    if (!themeName || typeof themeName !== 'string') {
      return false;
    }

    const instance = new Theme({themeName});
    this.sheet.changeTheme(instance.data);
    return true;
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


  public createSheet(sheetTitle: string, centralTopicTitle = 'Central Topic') {
    if (!sheetTitle) throw new Error('Title required');
    if (this.resources.hasOwnProperty(sheetTitle)) throw new Error('Title duplicated');

    const sheetId = this.id;
    this.resources[sheetTitle] = sheetId;

    const options = [{id: sheetId, sheetTitle, rootTopic: {id: this.id, title: centralTopicTitle}}];
    this.workbook = new Core.Workbook(options);
    this.sheet = this.workbook.getSheetById(sheetId);
    return this.sheet;
  }
}
