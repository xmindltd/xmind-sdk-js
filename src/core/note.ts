import { AbstractNote } from '../abstracts/note.abstract';

/**
 * @description Note class and XMind ZEN is supported
 * @implements AbstractNote
 * @property {*} html
 * @property {*} plain
 * @property {*} ops
 */
export class Note implements AbstractNote {
  public html: any;
  public plain: any;
  public ops: any;

  constructor() {
    this.html = {content: {paragraphs: []}};
    this.ops = {ops: []};
    this.plain = {};
  }

  /**
   * @description Format value
   * @param {any} value
   * @setter
   */
  set text(value) {
    this.plain.content = value;
    this.html.content.paragraphs.push({spans: [{text: value}]});
    this.ops.ops.push({insert: value});
  }

  public toJSON() {
    return {html: this.html, plain: this.plain, ops: this.ops};
  }

  /* istanbul ignore next */
  public toString() {
    return JSON.stringify(this.toJSON());
  }
}
