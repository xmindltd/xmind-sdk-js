import * as JSZip from 'jszip';
import Base from '../core/base';
import { Workbook } from '../core/workbook';
import { isObject } from './common';
import { PACKAGE_MAP } from '../common/constants';

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const iconv = require('iconv-lite');

/* istanbul ignore next */
const join = (process.platform === 'win32' ? path.win32.join : path.join);

const SUFFIX = '.xmind';
const DEFAULT_FILENAME = `default${SUFFIX}`;

interface ZipperOptions {
  path: string;
  workbook: Workbook;
  filename?: string;
}

/**
 * @description Zipper for .xmind file
 */
export class Zipper extends Base {
  public zip: JSZip;
  public manifest: any;

  public filename: string;
  public path: string;
  public workbook: Workbook;

  constructor(options: ZipperOptions) {
    super({debug: 'xmind-sdk:zipper'});
    if (!options.path || !fs.existsSync(options.path)) {
      this.debug('received %s', options.path);
      throw new Error('the `path` is required or must exists');
    }
    this.filename = options.filename || DEFAULT_FILENAME;
    this.filename = this.filename.endsWith(SUFFIX) ? this.filename : `${this.filename}${SUFFIX}`;
    this.path = options.path;
    this.zip = new JSZip();
    this.workbook = options.workbook || null;
    this.manifest = {
      'file-entries': {'content.json': {}, 'metadata.json':{}}
    };
  }

  public target() {
    return join(this.path, this.filename);
  }

  /**
   * @description Saving zip file
   * @return { Promise }
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
      compression: 'STORE',
      compressionOptions: { level: 9 }
    };

    const metadata = await this.zip.generateAsync(options);
    const target = join(this.path, this.filename);
    return promisify(fs.writeFile)(target, metadata)
      .then(() => true)
      .catch(/* istanbul ignore next */ () => false);
  }

  /**
   * @description Update manifest metadata
   * @param { String } key - a string key
   * @param { Buffer } content - file contents
   * @return { Zipper }
   */
  public updateManifestMetadata(key: string, content: Buffer) {
    if (!key) return this;
    if (!content || !Buffer.isBuffer(content)) {
      return this;
    }
    const arr = key.split('/');
    this.manifest['file-entries'][key] = {};
    this.zip.folder(arr[0]).file(arr[1], content, { binary: false });
    return this;
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
    this.zip.file(PACKAGE_MAP.MANIFEST.NAME, JSON.stringify(this.manifest));
    return this;
  }

  /**
   * @description add contents to content.json
   */
  private addJSONContent(contents: string) {
    if (isObject(contents)) {
      contents = JSON.stringify(contents);
    }
    this.zip.file(PACKAGE_MAP.CONTENT_JSON.NAME, iconv.decode(Buffer.from(contents), 'utf8'));
    return this;
  }

  /**
   * @description add contents to content.xml
   */
  private addXMLContent() {
    const p = join(__dirname, '../common/templates/content.xml');
    this.zip.file(PACKAGE_MAP.CONTENT_XML.NAME, iconv.decode(fs.readFileSync(p), 'utf8'));
    return this;
  }
}

