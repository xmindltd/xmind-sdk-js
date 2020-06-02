import { AbstractWorkbook } from '../abstracts/workbook.abstract';
import { Theme } from './theme';
import { ErrorObject } from 'ajv';
import { SheetData } from 'xmind-model/types/models/sheet';

import Base from './base';
import * as Core from 'xmind-model';

/**
 * @description The implementation of Workbook
 * @extends {Base}
 */
export class Workbook extends Base implements AbstractWorkbook {
  public sheet: Core.Sheet;
  private workbook: Core.Workbook;
  private readonly resources;
  private readonly sheets;

  constructor() {
    super();
    this.resources = {};
    this.sheets = {};
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

  public loadSheets(sheets: SheetData[]) {
    if (!sheets || !Array.isArray(sheets)) {
      throw new Error('sheets must be a valid array');
    }

    if (sheets.length <= 0) {
      throw new Error('Does not found any sheet');
    }

    this.workbook = new Core.Workbook(sheets);

    for (const sheet of sheets) {
      if (this.resources[sheet.title]) {
        throw new Error(`Sheet: ${sheet.title} is already exists`);
      }
      this.resources[sheet.title] = sheet.id;
      this.sheets[sheet.id] = this.workbook.getSheetById(sheet.id);
    }

    return this.sheets;
  }
}
