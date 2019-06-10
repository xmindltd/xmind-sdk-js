import { Summary } from '../core/summary';
import * as Core from 'xmind-model';

export interface SummaryOptions {
  title?: string;
  edge?: string;
}

export interface RangeOptions {
  children: Array<Core.Topic>;
  condition: Array<string>;
}

export interface SummaryDataStructure {
  id: string;
  range: string;
  topicId: string;
}

export interface AbstractSummary {

  /**
   * @description Set a range scope on the instance of Summary
   * @param {RangeOptions} options
   * @param {Array<Core.Topic>} options.children - An array of topic
   * @param {Array<string>} options.condition - An array of topicId that contains position of start and end
   * @return {String}
   */
  range(options: RangeOptions): Summary;

  /**
   * @description Get the full data structure
   * @return {SummaryDataStructure}
   */
  toJSON(): SummaryDataStructure;
}
