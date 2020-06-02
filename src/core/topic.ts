import {
  AbstractTopic,
  TopicOptions,
  MarkerOptions,
  ImageOptions
} from '../abstracts/topic.abstract';
import { SummaryOptions } from '../abstracts/summary.abstract';
import { Summary } from './summary';
import { Note } from './note';
import {isEmpty, isObject, isRuntime} from '../utils/common';
import Base from './base';
import * as Model from '../common/model';
import * as Core from 'xmind-model';
import {TopicData} from 'xmind-model/types/models/topic';

/**
 * @description Topic common methods
 */
export class Topic extends Base implements AbstractTopic {
  private readonly sheet: Core.Sheet;
  private readonly root: Core.Topic;
  private readonly resources: {[key: string]: string} = {};

  private componentId: string;
  private lastId: string;

  constructor(options: TopicOptions = <TopicOptions>{}) {
    super({debug: 'xmind-sdk:topic'});
    if (options && !options.sheet) {
      throw new Error('options.sheet is required');
    }

    this.sheet = options.sheet;
    this.root = this.sheet.getRootTopic();
    this.componentId = this.lastId = this.root.getId();
    this.resources[this.componentId] = this.root.getTitle() || 'Central Topic';

    if (options.isLoaded) {
      this.load(this.root.getChildren());
    }
    this.debug('D - %s and length = %d',
      JSON.stringify(this.resources, null, 2),
      Object.keys(this.resources).length
    );
  }

  public on(componentId?: string) {
    if (!componentId) {
      this.componentId = this.root.getId();
      return this;
    }

    if (!this.isValidTopicId(String(componentId))) {
      throw new Error(`Invalid componentId ${String(componentId)}`);
    }

    this.componentId = componentId;
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
    this.lastId = topic.id;
    return this;
  }

  public image(options?: ImageOptions) {
    /* istanbul ignore if */
    if (!isRuntime()) {
      throw new Error('Cannot run .image() in browser environment');
    }

    const cur = this.current();
    const dir = `resources/${this.id}`;
    const params = Object.assign({}, {src: `xap:${dir}`}, options || {});
    cur.addImage(params);
    return dir;
  }

  public note(text: string, del?: boolean) {
    const cur = this.current();
    if (del === true) {
      cur.removeNotes();
      return this;
    }
    if (!text) return this;
    const n = new Note();
    n.text = text;
    cur.addNotes(n.toJSON());
    return this;
  }

  public destroy(componentId: string) {
    if (!this.isValidTopicId(componentId)) {
      this.debug('E - target: "%s" does not exists', componentId);
      return this;
    }
    try {
      const topic = this.find(componentId);
      topic.parent().removeChildTopic(topic);
      delete this.resources[componentId];
    } catch (e) {
      /* istanbul ignore next */
      this.debug('D - %s', e.message);
    }
    return this;
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
    const type = <string>this.current().getType();
    const parent = this.current().parent();
    const children = parent.getChildrenByType(type);
    const condition = [this.componentId, !edge ? this.componentId : edge];
    summary.range({ children, condition });
    const summaryOptions = {title: options.title || 'Summary', id: this.id};
    summary.topicId = summaryOptions.id;
    parent.addSummary(summary.toJSON(), summaryOptions);
    this.resources[summaryOptions.id] = summaryOptions.title;
    this.lastId = summaryOptions.id;
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

    if (options.del === true) {
      delete options.del;
      this.current().removeMarker(options);
      return this;
    }

    this.current().addMarker(options);
    return this;
  }


  public cid(title?: string) {
    if (title && typeof title === 'string') {
      for (const topicId in this.resources) {
        if (this.resources[topicId] === title) {
          return topicId;
        }
      }
      return null;
    }
    return this.lastId;
  }

  public cids() {
    return this.resources;
  }

  public find(componentId: string = null) {
    const rootId = this.root.getId();

    if (!componentId || componentId === rootId) {
      return this.root;
    }

    return this.sheet.findComponentById(componentId);
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
   * @return {Core.Topic}
   * @private
   */
  private current() {
    return (this.componentId === this.root.getId()) ?
      this.root : this.find(this.componentId);
  }

  /**
   * @description Check topic id
   * @param {String} componentId
   * @return {Boolean}
   * @private
   */
  private isValidTopicId(componentId: string) {
    if (!componentId) {
      return false;
    }

    return this.resources.hasOwnProperty(componentId);
  }

  /**
   * @private
   * @description Auto load resources
   */
  private load(child?: TopicData) {
    this.resources[child.id] = child.title;
    if (child.hasOwnProperty('children')) {
      const { attached } = child['children'];
      for (let i = 0; i < attached.length; i++) {
        this.load(attached[i]);
        this.resources[attached[i]['id']] = attached[i]['title'];
      }

      if (child['children'].hasOwnProperty('summary')) {
        const { summary } = child['children'];
        for (let i = 0; i < summary.length; i++) {
          this.resources[summary[i]['id']] = summary[i]['title'];
        }
      }
    }

    return this;
  }
}
