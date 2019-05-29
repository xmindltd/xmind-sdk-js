import * as JSZip from 'jszip';

/**
 * @description Zipper kit abstraction
 */
export interface AbstractZipper {
  /**
   * @description .xmind saver
   * @param {String} [path]
   */
  save(path?: string): Promise<any>;
  addMetadataContents(content: JSZip.InputType): string;
  addManifestContents(content: JSZip.InputType): string;
  addJSONContent(content: JSZip.InputType): string;
  addXMLContent(content?: JSZip.InputType): string;
}
