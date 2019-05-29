import {
  AbstractTopic,
  TopicOptions,
  MarkerOptions
} from '../abstracts/topic.abstract';
import { SummaryOptions } from '../abstracts/summary.abstract';
import { Summary } from './summary';
import { Note } from './note';
import Base from './base';
import * as Model from '../common/model';
import Core = require('xmind-model');
import { isEmpty, isObject } from 'lodash';

const ROOT_TOPIC_TITLE = 'rootTopic';

/**
 * @description Topic common methods
 */
export class Topic extends Base implements AbstractTopic {
  private readonly sheet: Core.Sheet;
  private readonly root: Core.Topic;
  private readonly resources: {[key: string]: string} = {};

  private title: string = ROOT_TOPIC_TITLE;

  constructor(options: TopicOptions = <TopicOptions>{}) {
    super({debug: 'xmind-sdk:topic'});
    if (options && !options.sheet) {
      throw new Error('options.sheet is required');
    }

    this.sheet = options.sheet;
    this.root = this.sheet.getRootTopic();
  }

  public on(title?: string) {
    if (!title) {
      this.title = ROOT_TOPIC_TITLE;
      return this;
    } else {
      if (!this.isValidTitle(title)) {
        throw new Error('Invalid title:' + title);
      }
    }

    this.title = title;
    return this;
  }

  public add(topic: Model.Topic = <Model.Topic>{}, options?: {index: number}) {
    if (!topic.title || typeof topic.title !== 'string') {
      throw new Error('topic.title should be a valid string');
    }
    topic.id = topic.id || this.id;
    this.resources[topic.title] = topic.id;
    this.current().addChildTopic(topic, options);
    return this;
  }

  public note(text: string) {
    if (!text) return this;
    const n = new Note();
    n.text = text;
    this.current().addNotes(n.toJSON());
    return this;
  }

  public destroy(title: string) {
    if (!this.isValidTitle(title)) {
      this.debug('target: "%s" does not exists', title);
      return this;
    }
    try {
      const topic = this.find(title);
      topic.parent().removeChildTopic(topic);
      delete this.resources[title];
    } catch (e) {
      /* istanbul ignore next */
      this.debug('D - %s', e.message);
    }
    return this;
  }

  public find(title?: string) {
    const id = this.resources[title ? title : this.title];
    return this.sheet.findComponentById(id);
  }

  public summary(options: SummaryOptions = <SummaryOptions>{}) {
    if (this.current().isRootTopic()) {
      this.debug('I - Not allowed add summary on root topic.');
      return this;
    }

    let include = this.resources[this.title];
    if (options.include) {
      if (this.resources[options.include]) {
        include = this.resources[options.include];
      } else {
        this.debug('W - Topic "%s" does not exists', options.include);
      }
    }

    const summary = new Summary();
    const type = this.current().getType();
    const parent = this.current().parent();
    const children = parent.getChildrenByType(type);
    const condition = [this.resources[this.title], include];
    summary.range({ children, condition });
    const topic = {title: options.title || 'Summary', id: this.id};
    summary.topicId = topic.id;
    parent.addSummary(summary.toJSON(), topic);
    this.resources[topic.title] = topic.id;
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

  /**
   * @description Get root topic
   * @return {Topic}
   */
  get rootTopic() {
    /* istanbul ignore next */
    return this.root;
  }

  /**
   * @description Get current topic instance
   * @param {String} title
   * @return {Topic}
   * @private
   */
  private current(title?: string) {
    return (this.title === ROOT_TOPIC_TITLE) ?
      this.root : this.find(title);
  }

  /**
   * @description Check title
   * @param {String} title
   * @return {Boolean}
   * @private
   */
  private isValidTitle(title: string) {
    if (!title || typeof title !== 'string') return false;
    return this.resources.hasOwnProperty(title);
  }
}
