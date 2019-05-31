import { join } from 'path';
import { promisify } from 'util';
import { Workbook } from '..';
import { isObject } from 'lodash';
import * as fs from 'fs';
import Base from '../core/base';
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
 */
export class Zipper extends Base {
  protected zip: JSZip;

  public filename: string;
  public path: string;
  public workbook: Workbook;

  constructor(options: ZipperOptions) {
    super({debug: 'xmind-sdk:zipper'});
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
   * @return {Promise}
   * @public
   * @async
   */
  public async save() {
    if (this.workbook) {
      this.addJSONContent(this.workbook.toString());
      this.addMetadataContents();
      this.addXMLContent();
      this.addManifestContents();
    }

    const options: JSZip.JSZipGeneratorOptions = {
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {level: 9},
      platform: 'UNIX'
    };
    const metadata = await this.zip.generateAsync(options);
    const target = join(this.path, this.filename);
    return promisify(fs.writeFile)(target, metadata)
      .then(() => true)
      .catch(/* istanbul ignore next */ () => false);
  }

  /**
   * @description add contents to metadata.json file
   *
   */
  private addMetadataContents() {
    this.zip.file(PACKAGE_MAP.METADATA.NAME, '{}');
    return this;
  }

  /**
   * @description add contents to manifest.json
   */
  private addManifestContents() {
    this.zip.file(PACKAGE_MAP.MANIFEST.NAME, manifest);
    return this;
  }

  /**
   * @description add contents to content.json
   */
  private addJSONContent(contents: string) {
    if (isObject(contents)) {
      contents = JSON.stringify(contents);
    }
    this.zip.file(PACKAGE_MAP.CONTENT_JSON.NAME, contents);
    return this;
  }

  /**
   * @description add contents to content.xml
   */
  private addXMLContent() {
    const p = join(__dirname, '../common/templates/content.xml');
    this.zip.file(PACKAGE_MAP.CONTENT_XML.NAME, fs.readFileSync(p));
    return this;
  }
}

