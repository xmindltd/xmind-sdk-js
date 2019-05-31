import { AbstractTopic, TopicOptions, MarkerOptions } from '../abstracts/topic.abstract';
import { SummaryOptions } from '../abstracts/summary.abstract';
import { Summary } from './summary';
import { Note } from './note';
import { isEmpty, isObject } from 'lodash';
import Base from './base';
import * as Model from '../common/model';
import Core = require('xmind-model');

/**
 * @description Topic common methods
 */
export class Topic extends Base implements AbstractTopic {
  private readonly sheet: Core.Sheet;
  private readonly root: Core.Topic;
  private readonly resources: {[key: string]: string} = {};

  private _topicId: string;
  private _lastTopicId: string;

  constructor(options: TopicOptions = <TopicOptions>{}) {
    super({debug: 'xmind-sdk:topic'});
    if (options && !options.sheet) {
      throw new Error('options.sheet is required');
    }

    this.sheet = options.sheet;
    this.root = this.sheet.getRootTopic();
    this._topicId = this.root.getId();
    this.resources[this._topicId] = 'Central Topic';
  }

  public on(topicId?: string) {
    if (!topicId) {
      this._topicId = this.root.getId();
      return this;
    } else {
      if (!this.isValidTopicId(topicId)) {
        throw new Error('Invalid topic id:' + topicId);
      }
    }

    this._topicId = topicId;
    return this;
  }

  public add(topic: Model.Topic = <Model.Topic>{}, options?: {index: number}) {
    if (!topic.title || typeof topic.title !== 'string') {
      throw new Error('topic.title should be a valid string');
    }
    topic.id = topic.id || this.id;
    this.resources[topic.id] = topic.title;
    const cur = this.current();
    cur.addChildTopic(topic, options);
    this._lastTopicId = topic.id;
    return this;
  }

  public note(text: string) {
    if (!text) return this;
    const n = new Note();
    n.text = text;
    this.current().addNotes(n.toJSON());
    return this;
  }

  public destroy(topicId: string) {
    if (!this.isValidTopicId(topicId)) {
      this.debug('E - target: "%s" does not exists', topicId);
      return this;
    }
    try {
      const topic = this.find(topicId);
      topic.parent().removeChildTopic(topic);
      delete this.resources[topicId];
    } catch (e) {
      /* istanbul ignore next */
      this.debug('D - %s', e.message);
    }
    return this;
  }

  public find(topicId?: string) {
    return this.sheet.findComponentById(topicId || this._topicId);
  }

  public summary(options: SummaryOptions = <SummaryOptions>{}) {
    if (this.current().isRootTopic()) {
      this.debug('I - Not allowed add summary on root topic.');
      return this;
    }

    let edge = null;
    if (options.edge) {
      if (this.resources[options.edge]) {
        edge = options.edge;
      } else {
        this.debug('W - Topic "%s" does not exists', options.edge);
      }
    }

    const summary = new Summary();
    const type = this.current().getType();
    const parent = this.current().parent();
    const children = parent.getChildrenByType(type);
    const condition = [this._topicId, !edge ? this._topicId : edge];
    summary.range({ children, condition });
    const summaryOptions = {title: options.title || 'Summary', id: this.id};
    summary.topicId = summaryOptions.id;
    parent.addSummary(summary.toJSON(), summaryOptions);
    this.resources[summaryOptions.id] = summaryOptions.title;
    return this;
  }

  public marker(options: MarkerOptions = <MarkerOptions>{}) {
    if (
      !isObject(options) || isEmpty(options) ||
      !options['groupId'] || !options['markerId']
    ) {
      this.debug('E - Invalid marker options: %j', options);
      return this;
    }
    this.current().addMarker(options);
    return this;
  }


  public topicId(title?: string) {
    if (title && typeof title === 'string') {
      for (const topicId in this.resources) {
        if (this.resources[topicId] === title) {
          return topicId;
        }
      }
      return null;
    }
    return this._lastTopicId;
  }

  public topicIds() {
    return this.resources;
  }

  /**
   * @description Get root topic
   * @return {Topic}
   */
  get rootTopic() {
    /* istanbul ignore next */
    return this.root;
  }

  /**
   * @description Get root topicId
   */
  get rootTopicId() {
    return this.root.getId();
  }

  /**
   * @description Get current topic instance
   * @return {Topic}
   * @private
   */
  private current() {
    return (this._topicId === this.root.getId()) ? this.root : this.find(this._topicId);
  }

  /**
   * @description Check topic id
   * @param {String} topicId
   * @return {Boolean}
   * @private
   */
  private isValidTopicId(topicId: string) {
    if (!topicId || typeof topicId !== 'string') return false;
    return this.resources.hasOwnProperty(topicId);
  }
}
