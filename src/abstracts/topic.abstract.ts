import { Topic } from '../core/topic';
import { SummaryOptions } from './summary.abstract';
import * as Model from '../common/model';
import Core = require('xmind-model');

export interface TopicOptions {
  sheet: Core.Sheet;
};

export interface MarkerOptions {
  groupId: string;
  markerId: string;
}

export interface AbstractTopic {

  /**
   * @description Append a topic to the end of list
   * @param {Model.Topic} topic - The topic data model
   * @param {Object} options
   * @param {Number} options.index - The position where is the element in Map-Tree
   * @return {Topic} The topic that was appended will be returned
   */
  add(topic: Model.Topic, options?: {index: number}): Topic;

  /**
   * @description Insert a topic to the list where the index specified
   * @param {String} [title] - The topic title default: `rootTopic`
   * @return {Topic} The topic that was appended will be returned
   */
  on(title?: string): Topic;

  /**
   * @description Get topic by title
   * @param {String} title
   * @return {Core.Topic} - Given null if topic title does not found
   */
  find(title?: string): Core.Topic;

  /**
   * @description Destroy a topic from Map-Tree
   * @param {String} title
   * @return {Topic}
   */
  destroy(title: string): Topic;

  /**
   * @description Add summary info to topic or scope of topic
   * @param {SummaryOptions} [options]
   * @return {Topic}
   */
  summary(options: SummaryOptions): Topic;

  /**
   * @description Add marker to topic
   * @param {MarkerOptions} options - The groupId & markerId
   * @return {Topic}
   */
  marker(options: MarkerOptions): Topic;
}
