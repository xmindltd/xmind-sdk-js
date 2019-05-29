import { AbstractSheet, OutputSheetOptions } from '../abstracts/sheet.abstract';
import * as uuid from 'uuid/v4';
import { Theme } from './theme';
import Core = require('xmind-model');

/**
 * @description Sheet
 * @implements AbstractSheet
 */
export class Sheet implements AbstractSheet {
  public workbook: Core.Workbook;

  private readonly limits: object;

  constructor(protected options?: any) {
    this.workbook = null;
    this.limits = {};
    this.options = options;
  }

  public createSheet(title: string, topicTitle = 'Central Topic') {
    const required = 'Title required';
    if (!title) throw new Error(required);

    const duplication = 'Title duplicated';
    if (this.limits.hasOwnProperty(title)) throw new Error(duplication);

    const sheetId = uuid();
    this.limits[title] = sheetId;

    const options = [{id: sheetId, title, rootTopic: {id: uuid(), title: topicTitle}}];
    this.workbook = new Core.Workbook(options);
    return this.getSheetBy({id: sheetId});
  }

  public getSheetBy(options: OutputSheetOptions) {
    let sheetId = undefined;
    if (options.id) sheetId = options.id;
    if (options.title) sheetId = this.limits[options.title];
    return this.workbook.getSheetById(sheetId);
  }

  public theme(sheetTitle:string, themeName: string) {
    /* istanbul ignore next */
    if (!sheetTitle || !this.limits[sheetTitle]) {
      return false;
    }
    /* istanbul ignore next */
    if (!themeName || typeof themeName !== 'string') {
      return false;
    }

    const sheet = this.getSheetBy({id: this.limits[sheetTitle]});
    const instance = new Theme({themeName});
    sheet.changeTheme(instance.data);
    return true;
  }
}
