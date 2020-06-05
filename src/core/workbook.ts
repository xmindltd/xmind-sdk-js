import { AbstractWorkbook } from '../abstracts/workbook.abstract';
import { Theme } from './theme';
import Base from './base';
import * as Core from 'xmind-model';
import { ErrorObject } from 'ajv';

/**
 * @description The implementation of Workbook
 * @extends {Base}
 */
export class Workbook extends Base implements AbstractWorkbook {
  public sheet: Core.Sheet;
  private workbook: Core.Workbook;
  private readonly resources;


  constructor() {
    super();
    this.resources = {};
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


  public toString() {
    return this.workbook.toString();
  }

  public toJSON() {
    return this.workbook.toJSON();
  }

  public validate() {
    return Core.validator(this.workbook.toJSON()) as {
      status: boolean,
      errors: ErrorObject[]
    };
  }

  public createSheet(sheetTitle: string, centralTopicTitle = 'Central Topic') {
    if (!sheetTitle) {
      throw new Error('The title of sheet is required');
    }

    if (this.resources.hasOwnProperty(sheetTitle)) {
      throw new Error('The title of sheet is duplication');
    }

    const sheetId = this.id;
    this.resources[sheetTitle] = sheetId;

    const options = [{id: sheetId, title: sheetTitle, rootTopic: {id: this.id, title: centralTopicTitle}}];
    this.workbook = new Core.Workbook(options);
    this.sheet = this.workbook.getSheetById(sheetId);
    return this.sheet;
  }
}
