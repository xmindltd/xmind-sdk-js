import { join } from 'path';
import { readFileSync } from 'fs';
import * as Debug from 'debug';
import * as v4 from 'uuid/v4';
import * as Model from '../common/model';

const debug = Debug('xmind-sdk:theme');
const THEME_PATH = join(__dirname, '../common/themes/');
const ALLOWED_THEMES = ['robust', 'snowbrush', 'business'];

interface ThemeOptions {
  themeName: string;
}

export class Theme {
  private readonly value: Model.Theme;

  constructor(options: ThemeOptions = <ThemeOptions>{}) {
    const name = options.themeName;
    if (!name || typeof name !== 'string' ||
      !ALLOWED_THEMES.includes(name.toLocaleLowerCase())) {
      debug('W - Only ', ALLOWED_THEMES.join(', '), 'are allowed for now.');
      throw new Error(`the theme name ${name} is not allowed`);
    }

    this.value = Theme.loader(name);
  }

  get data() {
    return this.value;
  }

  static loader(name: string) {
    try {
      if (!name || typeof name !== 'string') {
        return null;
      }
      const title = name.endsWith('.json') ? name.split('.')[0] : name;
      name = name.endsWith('.json') ? name : `${name}.json`;
      let theme = JSON.parse(readFileSync(join(THEME_PATH, name), {encoding: 'utf8'}));
      theme.id = v4();
      theme.title = title;
      return theme;
    } catch (e) { debug('E - %s', e.message); }
  }
}
