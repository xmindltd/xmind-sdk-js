import { Node } from 'tree-model';
const TreeModel = require('tree-model');
const v4 = require('uuid/v4');
const Debug = require('debug');

export interface BaseOptions {
  debug?: string;
  instance?: any;
}

export interface TreeNodeOptions {
  id: string;
  title: string;
  customId?: number | string | null;
  parentId?: number | string | null;
}

export interface ConflictedOnDifferentBranchOptions extends Pick<TreeNodeOptions, 'title' | 'parentId'> {}

export interface ConflictedOnSameBranchOptions extends Pick<TreeNodeOptions, 'title' | 'customId'> {}

const DEFAULT_DEBUG_SCOPE = 'xmind-sdk';

export default class Base {
  private readonly _debug;

  protected tree = new TreeModel();

  protected rootNode: Node<TreeNodeOptions>;

  /* istanbul ignore next */
  constructor(protected options: BaseOptions = <BaseOptions>{}) {
    this.options = options;
    this._debug = Debug(this.options.debug || DEFAULT_DEBUG_SCOPE);
  }

  protected setRoot(options: TreeNodeOptions) {
    this.rootNode = this.tree.parse(Object.assign(options, { children: [] }));
    return this;
  }

  protected destroyNode(options: Pick<TreeNodeOptions, 'id'>): boolean {
    const node = this.rootNode.first((node: Node<TreeNodeOptions>) => {
      return node.model.id === options.id;
    });
    node.drop();
    return true;
  }

  protected addChildNode(options: TreeNodeOptions) {
    const node = this.rootNode.first((node: Node<TreeNodeOptions>) => {
      return node.model.id === options.parentId;
    });
    node.addChild(this.tree.parse(options));
  }

  /**
   *
   * @param { ConflictedOnDifferentBranchOptions | ConflictedOnSameBranchOptions } options
   * @return { String | Null }
   */
  protected getConflictedComponentId(
    options: ConflictedOnDifferentBranchOptions & ConflictedOnSameBranchOptions
  ): string | null {
    if (options.title && options.parentId) {
      return this.different(options);
    }

    if (options.title && options.customId) {
      return this.identical(options);
    }

    return null;
  }

  /**
   * @description Print debug information
   * @param {Array} args - the rest arguments
   */
  public debug(...args) {
    this._debug(...args);
  }

  /**
   * @description uuid/v4
   */
  get id(): string {
    return v4();
  }

  private different(options: ConflictedOnDifferentBranchOptions): string | null {
    const finder = (node: Node<TreeNodeOptions>) => {
      return node.model.title === options.title;
    };
    for (const node of this.rootNode.all(finder)) {
      if (node.parent.model.id === options.parentId) {
        return node.model.id;
      }
    }

    return null;
  }

  private identical(options: ConflictedOnSameBranchOptions) {
    const finder = (node: Node<TreeNodeOptions>) => {
      return node.model.title === options.title &&
        node.model.customId === options.customId;
    };

    const nodes = this.rootNode.all(finder);
    if (nodes.length <= 0) {
      return null;
    }

    return nodes[0].model.id;
  }
}
