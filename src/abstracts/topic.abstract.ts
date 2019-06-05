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
   * @description Set topic as the parent node
   * @param {String} [componentId] - The root topic will be used as the parent node if you don't given
   * @return {Topic}
   */
  on(componentId?: string): Topic;

  /**
   * @description Add a topic on the parent node
   * @param {Model.Topic} topic - The topic data model
   * @param {Object} options
   * @param {String} options.title - The title of topic
   * @param {Number} [options.index] - The position where the element in map tree
   * @return {Topic}
   */
  add(topic: Model.Topic, options?: {index: number}): Topic;

  /**
   * @description Get topic by topicId
   * @param {String} componentId
   * @return {Core.Topic}
   */
  find(componentId: string): Core.Topic;

  /**
   * @description Destroy a component from map tree
   * @param {String} componentId
   * @return {Topic}
   */
  destroy(componentId: string): Topic;

  /**
   * @description Add info of summary to topic and range topics
   * @param {SummaryOptions} [options]
   * @param {String} options.title - The title of summary
   * @param {String} options.edge - A topicId for the range of summary
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
   * @description Get the topicId that you have added.
   * * In default, It's going to return the last topicId
   * @param {String} title - Find out topicId by `Title`.
   * @return {String}
   */
  cid(title?: string): string;


  /**
   * @description Get an object that contains pairs of $topicId and $title
   * @return {Object}
   */
  cids(): object;
}
