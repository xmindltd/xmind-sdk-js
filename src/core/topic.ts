import {
  AbstractTopic, TopicOptions,
  MarkerOptions, ImageOptions
} from '../abstracts/topic.abstract';
import { SummaryOptions } from '../abstracts/summary.abstract';
import { Summary } from './summary';
import { Note } from './note';
import { isEmpty, isObject, isString } from '../utils/common';

import * as Model from '../common/model';
import * as Core from 'xmind-model';
import Base from './base';


/**
 * @description Topic common methods
 */
export class Topic extends Base implements AbstractTopic {
  private readonly sheet: Core.Sheet;
  private readonly root: Core.Topic;

  private parentId: string;
  private lastId: string;

  constructor(options: TopicOptions = <TopicOptions>{}) {
    super({debug: 'xmind-sdk:topic'});
    if (options && !options.sheet) {
      throw new Error('options.sheet is required');
    }

    this.sheet = options.sheet;
    this.root = this.sheet.getRootTopic();
    this.parentId = this.lastId = this.root.getId();
    this.setRoot({ id: this.parentId, title: 'Central Topic' });
  }

  public on(componentId?: string): Topic {
    if (!componentId) {
      this.parentId = this.root.getId();
      return this;
    }

    if (!this.isValidComponentId(String(componentId))) {
      throw new Error(`Invalid componentId ${String(componentId)}`);
    }

    this.parentId = componentId;
    return this;
  }

  public addLabel(text: string): Topic {
    const p = this.parent();
    const labels = p.getLabels();
    const options = { index: 0 };
    if (!labels || labels.length === 0) {
      options.index = 0;
    } else {
      options.index = labels.length;
    }
    p.addLabel(text, options);
    return this;
  }

  public removeLabel(componentId?: string): Topic {
    const p = componentId ? this.find(componentId) : this.parent();
    if (!p) {
      throw new Error(`does not found component: ${componentId}`);
    }
    p.removeLabels();
    return this;
  }

  public add(topic: Model.Topic & {
    customId?: string | number, parentId?: string
  } = {} as any, options?: { index: number }): Topic {
    if (!isString(topic.title)) {
      throw new Error('topic.title should be a valid string');
    }
    topic.id = topic.id || this.id;
    this.parent().addChildTopic(topic, options);
    this.addChildNode({
      id: topic.id, title: topic.title,
      customId: topic.customId || null,
      parentId: topic.parentId || this.parentId
    });
    this.lastId = topic.id;
    return this;
  }

  public image(options?: ImageOptions): string {
    const dir = `resources/${this.id}`;
    const params = Object.assign({}, {src: `xap:${dir}`}, options || {});
    this.parent().addImage(params);
    return dir;
  }

  public note(text: string, del?: boolean): Topic {
    const p = this.parent();
    if (del === true) {
      p.removeNotes();
      return this;
    }
    if (!text) return this;
    const n = new Note();
    n.text = text;
    p.addNotes(n.toJSON());
    return this;
  }

  public destroy(componentId: string): Topic {
    if (!this.isValidComponentId(componentId)) {
      this.debug('E - target: "%s" does not exist', componentId);
      return this;
    }
    try {
      const topic = this.find(componentId);
      topic.parent().removeChildTopic(topic);
      this.destroyNode({ id: componentId });
    } catch (e) {
      /* istanbul ignore next */
      this.debug('D - %s', e.message);
    }
    return this;
  }

  public summary(options: SummaryOptions = <SummaryOptions>{}): Topic {
    if (this.parent().isRootTopic()) {
      this.debug('I - Not allowed add summary on root topic.');
      return this;
    }

    let edge = null;
    if (options.edge) {
      if (this.exist(options.edge)) {
        edge = options.edge;
      } else {
        this.debug('W - Topic "%s" does not exist', options.edge);
      }
    }

    const summary = new Summary();
    const type = this.parent().getType();
    const grandfather = this.grandfather();
    const children = grandfather.getChildrenByType(type);
    const condition = [this.parentId, !edge ? this.parentId : edge];
    summary.range({ children, condition });
    const summaryOptions = {title: options.title || 'Summary', id: this.id};
    summary.topicId = summaryOptions.id;
    grandfather.addSummary(summary.toJSON(), summaryOptions);
    this.addChildNode({
      id: summaryOptions.id, title: summaryOptions.title,
      parentId: this.parentId
    });
    this.lastId = summaryOptions.id;
    return this;
  }

  public marker(options: MarkerOptions = <MarkerOptions>{}): Topic {
    if (
      !isObject(options) || isEmpty(options) ||
      !options['groupId'] || !options['markerId']
    ) {
      this.debug('E - Invalid marker options: %j', options);
      return this;
    }

    if (options.del === true) {
      delete options.del;
      this.parent().removeMarker(options);
      return this;
    }

    this.parent().addMarker(options);
    return this;
  }


  public cid(title?: string, dependencies: {
    parentId?: number | string, customId?: number | string
  } = {}): string | null {
    const validTitle = isString(title);
    if (validTitle && dependencies) {
      if (dependencies.parentId) {
        return this.getConflictedComponentId({
          title, parentId: dependencies.parentId
        });
      }
      if (dependencies.customId) {
        return this.getConflictedComponentId({
          title, customId: dependencies.customId
        });
      }
    }

    if (validTitle) {
      return this.findComponentIdBy(title);
    }
    return this.lastId;
  }

  public cids(): Record<string, string> {
    return this.all();
  }

  public find(componentId: string = null) {
    const rootId = this.root.getId();

    if (!componentId || componentId === rootId) {
      return this.root;
    }

    return this.sheet.findComponentById(componentId);
  }

  private grandfather() {
    return this.parent().parent();
  }

  private parent() {
    return this.parentId === this.root.getId() ?
      this.root :
      this.sheet.findComponentById(this.parentId);
  }

  get rootTopic() {
    /* istanbul ignore next */
    return this.root;
  }

  get rootTopicId() {
    return this.root.getId();
  }
}
