import { AbstractSummary, RangeOptions } from '../abstracts/summary.abstract';
import Base from './base';

export class Summary extends Base implements AbstractSummary {
  private _range: string;

  public topicId: string;

  constructor() {
    super({debug: 'xmind-sdk:summary'});
  }

  public range(options: RangeOptions) {
    const children = options.children;
    const condition = options.condition;

    if (condition[0] === condition[1]) {
      for (let i = 0, len = children.length; i < len; i++) {
        if (children[i].getId() === condition[0]) {
          this._range = `(${i},${i})`;
        }
      }
    } else {
      let s, e = 0;
      for (let i = 0, len = children.length; i < len; i++) {
        if (children[i].getId() === condition[0]) {
          s = i;
        }

        if (children[i].getId() === condition[1]) {
          e = i;
        }
      }
      this._range = s > e ? `(${s},${s})`: `(${s},${e})`;
    }

    return this;
  }

  public toJSON() {
    return { id: this.id, range: this._range, topicId: this.topicId };
  }
}
