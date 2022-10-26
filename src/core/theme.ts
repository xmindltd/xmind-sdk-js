import * as Model from '../common/model';

const Robust = require('../common/themes/robust.json');
const Snowbrush = require('../common/themes/snowbrush.json');
const Business = require('../common/themes/business.json');

const v4 = require('uuid/v4');
const debug = require('debug')('xmind-sdk:theme');
const ALLOWED_THEMES = ['robust', 'snowbrush', 'business'];

interface ThemeOptions {
  themeName: string;
}

const THEMES = {
  robust: Robust,
  snowbrush: Snowbrush,
  business: Business,
};

/**
 * @description Invisible external
 */
export class Theme {
  private readonly value: Model.Theme;

  constructor(options: ThemeOptions = <ThemeOptions>{}) {
    const name = options.themeName;
    if (!name || typeof name !== 'string' ||
      !ALLOWED_THEMES.includes(name.toLocaleLowerCase())) {
      debug('W - Only ', ALLOWED_THEMES.join(', '), 'are allowed for now.');
      throw new Error(`the theme name ${name} is not allowed`);
    }

    this.value = this.loader(name);
  }

  get data() {
    return this.value;
  }

  private loader(name: string) {
    const theme = THEMES[name];
    theme.id = v4();
    theme.title = name;
    return theme;
  }
}
