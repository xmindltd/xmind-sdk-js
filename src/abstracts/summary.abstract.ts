import { Summary } from '../core/summary';
import Core = require('xmind-model');

export interface SummaryOptions {
  title?: string;
  edge?: string;
}

export interface RangeOptions {
  children: Array<Core.Topic>;
  condition: Array<string>;
}

export interface AbstractSummary {
  range(options: RangeOptions): Summary;
  toJSON(): any;
}
