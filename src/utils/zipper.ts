import { AbstractZipper } from '../abstracts/zipper';
import { isObject } from 'lodash';
import { join } from 'path';
import { promisify } from 'util';
import {Workbook} from '..';
import * as fs from 'fs';
import JSZip = require('jszip');

const PACKAGE_MAP = {
  MANIFEST: { NAME: 'manifest.json', TYPE: 'json' },
  CONTENT_JSON: { NAME: 'content.json', TYPE: 'json'},
  CONTENT_XML: { NAME: 'content.xml', TYPE: 'xml'},
  METADATA: { NAME: 'metadata.json', TYPE: 'json'},
  THUMBNAILS: {NAME: 'Thumbnails', TYPE: 'directory'},
  RESOURCES: { NAME: 'resources', TYPE: 'directory'}
};

const SUFFIX = '.xmind';
const DEFAULT_FILENAME = `default${SUFFIX}`;
const manifest = '{"file-entries":{"content.json":{},"metadata.json":{}}}';

interface ZipperOptions {
  path: string;
  filename?: string;
  workbook?: Workbook;
}

/**
 * @description Zipper for .xmind file
 * @implements AbstractZipper
 */
class Zipper implements AbstractZipper {
  protected zip: JSZip;

  public filename: string;
  public path: string;
  public workbook: Workbook;

  constructor(protected options: ZipperOptions) {
    if (!options.path || !fs.existsSync(options.path)) {
      throw new Error('the `path` is required or must exists');
    }
    this.filename = options.filename || DEFAULT_FILENAME;
    this.filename = this.filename.endsWith(SUFFIX) ? this.filename : `${this.filename}${SUFFIX}`;
    this.path = options.path;
    this.zip = new JSZip();
    this.workbook = options.workbook || null;
  }

  /**
   * @description Saving zip file
   * @param {String} path - an absolute path
   * @return {Promise}
   * @public
   * @async
   */
  public async save(path?: string) {
    if (this.workbook) {
      this.addJSONContent(this.workbook.toString());
      this.addMetadataContents({});
      this.addXMLContent();
      this.addManifestContents();
    }
    const options: JSZip.JSZipGeneratorOptions = {
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {level: 9}
    };
    const metadata = await this.zip.generateAsync(options);
    const target = join((path ? path : this.path), this.filename);
    return promisify(fs.writeFile)(target, metadata)
      .then(() => true)
      .catch(/* istanbul ignore next */ () => false);
  }

  /**
   * @description add contents to metadata.json file
   * @param {String | Object} content
   * @return {String}
   * @public
   */
  public addMetadataContents(content: string | object) {
    /* istanbul ignore next */
    if (isObject(content)) {
      content = JSON.stringify(content);
    }
    this.zip.file(PACKAGE_MAP.METADATA.NAME, content);
    return this.zip.file(PACKAGE_MAP.METADATA.NAME).name;
  }

  /**
   * @description add contents to manifest.json
   * @param {String} content
   * @return {String}
   * @public
   */
  public addManifestContents(content: string = manifest) {
    this.zip.file(PACKAGE_MAP.MANIFEST.NAME, content);
    return this.zip.file(PACKAGE_MAP.MANIFEST.NAME).name;
  }

  /**
   * @description add contents to content.json
   * @param {String | Object} content
   * @return {String}
   * @public
   */
  public addJSONContent(content: string | object) {
    if (isObject(content)) {
      content = JSON.stringify(content);
    }
    this.zip.file(PACKAGE_MAP.CONTENT_JSON.NAME, content);
    return this.zip.file(PACKAGE_MAP.CONTENT_JSON.NAME).name;
  }

  /**
   * @description add contents to content.xml
   * @param {*} [content]
   * @return {String}
   * @public
   */
  public addXMLContent(content?: any) {
    const p = join(__dirname, '../common/templates/content.xml');
    this.zip.file(PACKAGE_MAP.CONTENT_XML.NAME, fs.createReadStream(p));
    return this.zip.file(PACKAGE_MAP.CONTENT_XML.NAME).name;
  }
}

export default Zipper;

