import Core = require('xmind-model');

export interface OutputSheetOptions {
  id?: string;
  title?: string;
}

/**
 * @description Sheet abstraction
 */
export interface AbstractSheet {
  /**
   * @description Create a sheet on workbook
   * @param {String} title - The title of sheet
   * @param {String} topicTitle - The title of root topic
   * @return {Topic}
   */
  createSheet(title: string, topicTitle?: string): Core.Sheet;

  /**
   * @description Get a sheet instance from workbook
   * @param {OutputSheetOptions} options
   * @param {String} options.title - get sheet by title
   * @param {String} options.id - get sheet by id
   * @return {Sheet}
   */
  getSheetBy(options: OutputSheetOptions): Core.Sheet;

  /**
   * @description Set sheet theme
   * @param {String} title - sheet title
   * @param {String} theme - theme name
   * @return {Boolean}
   */
  theme(title: string, theme: string): boolean;
}
