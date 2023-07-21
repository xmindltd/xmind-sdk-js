import * as Core from 'xmind-model';
import { SheetData } from 'xmind-model/types/models/sheet';


export interface CreateSheetsOptions {
  s: string;
  t: string;
}

export interface ResponseOfSheets {
  id: string;
  title: string;
}


export interface AbstractWorkbook {

  /**
   * @description Create a instance of Sheet
   * @param {String} sheetTitle
   * @param {String} [centralTopicTitle]
   */
  createSheet(sheetTitle: string, centralTopicTitle: string): Core.Sheet;


  /**
   * To create sheet in batch mode
   * @param {Object[{
   *   s: string,
   *   t: string
   * }]} options
   */
  createSheets(options: CreateSheetsOptions[]): ResponseOfSheets[];

  /**
   * Get sheet back
   * @param {String} id
   */
  getSheet(id: string): Core.Sheet;

  /**
   * Get all sheet information that you created
   */
  getSheets(): ResponseOfSheets[];

 /**
   * @description Loading sheets from an exists .xmind file
   * @param {Array<SheetData>} sheets - Extracted sheets
   * @return AbstractWorkbook
   */
 loadSheets(sheets: SheetData[]): {
  [propName: string]: Core.Sheet
};

  /**
   * @description Set theme color
   * @param {String} sheetTitle
   * @param {String} themeName
   */
  theme(sheetTitle:string, themeName: string): boolean;


  /**
   * @description Formatting Mind-map data as String
   * @return {String}
   */
  toString(): string;

  /**
   * @description Formatting Mind-map data as JSON
   * @return {Object}
   */
  toJSON(): object;


  /**
   * @description Validate Mind-map data
   * @return {status: boolean, errors: Array<object>} The `status` indicates result and you also can get errors
   */
  validate(): {status: boolean, errors: Array<object>};
}
