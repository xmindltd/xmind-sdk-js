import * as fs from 'fs';
import * as path from 'path';

const {join, win32 } = path;

const getBuildTemporaryPath: (filename?: string) => string = function(filename) {
  if (process.platform === 'win32') {
    if (!fs.existsSync(win32.normalize('C:\\tmp'))) {
      fs.mkdirSync(win32.normalize('C:\\tmp'));
    }
    return filename ? win32.join(win32.normalize('C:\\tmp'), filename): win32.normalize('C:\\tmp');
  }

  return filename ? join('/tmp', filename): '/tmp';
}

export {
  getBuildTemporaryPath
};
