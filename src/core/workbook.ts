import {
  AbstractWorkbook,
  CreateSheetsOptions,
  ResponseOfSheets
} from '../abstracts/workbook.abstract';
import { Theme } from './theme';
import Base from './base';
import * as Core from 'xmind-model';
import { ErrorObject } from 'ajv';
import { SheetData } from 'xmind-model/types/models/sheet';

/**
 * @description The implementation of Workbook
 * @extends {Base}
 */
export class Workbook extends Base implements AbstractWorkbook {
  public sheet: Core.Sheet;
  private workbook: Core.Workbook;
  private readonly resources;
  private sheets;

  constructor() {
    super();
    this.resources = {};
    this.sheets ={};
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

  public getSheets(): ResponseOfSheets[] {
    return Object.entries(this.resources || {})
      .map(sheet => ({ id: sheet[1] as string, title: sheet[0] }));
  }

  public getSheet(id: string) {
    if (!id) {
      throw new Error('The sheetId is required');
    }
    return this.workbook.getSheetById(id);
  }

  public createSheets(options: CreateSheetsOptions[] = []): ResponseOfSheets[] {
    if (options.length <= 0) {
      throw new Error('Options are empty');
    }

    const sheets = [];
    const created = [];
    for (let i = 0; i < options.length; i++) {
      if (this.resources.hasOwnProperty(options[i].s)) {
        continue;
      }
      const id = this.id;
      this.resources[options[i].s] = id;
      const sheetBody = { id, title: options[i].s };
      const rootTopic = { rootTopic: { id: this.id, title: options[i].t } };
      sheets.push(Object.assign({}, sheetBody, rootTopic));
      created.push(sheetBody);
    }

    this.workbook = new Core.Workbook(sheets);
    return created;
  }

  public createSheet(sheetTitle: string, centralTopicTitle = 'Central Topic') {
    if (!sheetTitle) {
      throw new Error('The title of sheet is required');
    }

    if (this.resources.hasOwnProperty(sheetTitle)) {
      throw new Error('You are trying to create the sheet repeatedly that is not allowed');
    }

    const sheetId = this.id;
    this.resources[sheetTitle] = sheetId;

    const options = [{
      id: sheetId, title: sheetTitle,
      rootTopic: { id: this.id, title: centralTopicTitle }
    }];
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
