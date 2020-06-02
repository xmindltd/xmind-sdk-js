import Loader from '../src/core/loader';
import * as path from 'path';
import * as fs from 'fs';
import * as JSZip from 'jszip';

const main = async () => {
  const zip = fs.readFileSync(path.resolve(__dirname, './fixtures/default.xmind'));
  const unzipped = await JSZip.loadAsync(zip);
  const loader = new Loader({ctx: unzipped});
  const sheets = await loader.loadSheets();
  console.info(sheets);
  return sheets;
};

main().then(ret => {}).catch(err => console.error(err));