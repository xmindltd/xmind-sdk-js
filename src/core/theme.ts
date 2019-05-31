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
    const contents = readFileSync(join(THEME_PATH, `${name}.json`), {encoding: 'utf8'});
    const theme = JSON.parse(contents);
    theme.id = v4();
    theme.title = name;
    return theme;
  }
}
