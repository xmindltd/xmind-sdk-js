import Core = require('xmind-model');

export interface AbstractWorkbook {

  /**
   * @description Create a instance of Sheet
   * @param {String} sheetTitle
   * @param {String} [centralTopicTitle]
   */
  createSheet(sheetTitle: string, centralTopicTitle: string): Core.Sheet;

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
}
