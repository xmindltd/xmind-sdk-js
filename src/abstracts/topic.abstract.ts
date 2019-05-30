import { Topic } from '..';
import { SummaryOptions } from './summary.abstract';
import * as Model from '../common/model';
import Core = require('xmind-model');

export interface TopicOptions {
  sheet: Core.Sheet;
}

export interface MarkerOptions {
  groupId: string;
  markerId: string;
}

export interface AbstractTopic {

  /**
   * @description Adding a topic component on the internal topic that specified by call .on()
   * @param {Model.Topic} topic - The topic data model
   * @param {Object} options
   * @param {Number} options.index - The position where is the element in Map-Tree
   * @return {Topic} The topic that was appended will be returned
   */
  add(topic: Model.Topic, options?: {index: number}): Topic;

  /**
   * @description Set the direction of the internal topic of the instance
   * @param {String} [topicId]
   * @return {Topic} The topic that was appended will be returned
   */
  on(topicId?: string): Topic;

  /**
   * @description Get topic by topicId
   * @param {String} topicId
   * @return {Core.Topic} - Given null if topic title does not found
   */
  find(topicId?: string): Core.Topic;

  /**
   * @description Destroy a topic from Map-Tree
   * @param {String} topicId
   * @return {Topic}
   */
  destroy(topicId: string): Topic;

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

  /**
   * @description Get the id of direction of current internal topic
   * * In default, It's going to return the last topic id that was you specified
   * @param {String} title - Use the title to find out topicId
   * @return {String}
   */
  topicId(title?: string): string;

  /**
   * @description Get a collection of the topicId and title string
   * @return {Object}
   */
  topicIds(): object;
}
