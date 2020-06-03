import * as Core from 'xmind-model';
import { SheetData } from 'xmind-model/types/models/sheet';

export interface AbstractWorkbook {

  /**
   * @description Create a instance of Sheet
   * @param {String} sheetTitle
   * @param {String} [centralTopicTitle]
   * @return Core.Sheet
   */
  createSheet(sheetTitle: string, centralTopicTitle: string): Core.Sheet;

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
   * @return {Boolean}
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
