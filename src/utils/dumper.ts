import { Workbook } from '../core/workbook';

const XMLContents = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><xmap-content xmlns="urn:xmind:xmap:xmlns:content:2.0" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" modified-by="bruce" timestamp="1503058545540" version="2.0"><sheet id="7abtd0ssc7n4pi1nu6i7b6lsdh" modified-by="bruce" theme="0kdeemiijde6nuk97e4t0vpp54" timestamp="1503058545540"><topic id="1vr0lcte2og4t2sopiogvdmifc" modified-by="bruce" structure-class="org.xmind.ui.logic.right" timestamp="1503058545417"><title>Warning
警告
Attention
Warnung
경고</title><children><topics type="attached"><topic id="71h1aip2t1o8vvm0a41nausaar" modified-by="bruce" timestamp="1503058545423"><title svg:width="500">This file can not be opened normally, please do not modify and save, otherwise the contents will be permanently lost！</title><children><topics type="attached"><topic id="428akmkh9a0tog6c91qj995qdl" modified-by="bruce" timestamp="1503058545427"><title>You can try using XMind 8 Update 3 or later version to open</title></topic></topics></children></topic><topic id="2kb87f8m38b3hnfhp450c7q35e" modified-by="bruce" timestamp="1503058545434"><title svg:width="500">该文件无法正常打开，请勿修改并保存，否则文件内容将会永久性丢失！</title><children><topics type="attached"><topic id="3m9hoo4a09n53ofl6fohdun99f" modified-by="bruce" timestamp="1503058545438"><title>你可以尝试使用 XMind 8 Update 3 或更新版本打开</title></topic></topics></children></topic><topic id="7r3r4617hvh931ot9obi595r8f" modified-by="bruce" timestamp="1503058545444"><title svg:width="500">該文件無法正常打開，請勿修改並保存，否則文件內容將會永久性丟失！</title><children><topics type="attached"><topic id="691pgka6gmgpgkacaa0h3f1hjb" modified-by="bruce" timestamp="1503058545448"><title>你可以嘗試使用 XMind 8 Update 3 或更新版本打開</title></topic></topics></children></topic><topic id="0f2e3rpkfahg4spg4nda946r0b" modified-by="bruce" timestamp="1503058545453"><title svg:width="500">この文書は正常に開かないので、修正して保存しないようにしてください。そうでないと、書類の内容が永久に失われます。！</title><children><topics type="attached"><topic id="4vuubta53ksc1falk46mevge0t" modified-by="bruce" timestamp="1503058545457"><title>XMind 8 Update 3 や更新版を使って開くこともできます</title></topic></topics></children></topic><topic id="70n9i4u3lb89sq9l1m1bs255j5" modified-by="bruce" timestamp="1503058545463"><title svg:width="500">Datei kann nicht richtig geöffnet werden. Bitte ändern Sie diese Datei nicht und speichern Sie sie, sonst wird die Datei endgültig gelöscht werden.</title><children><topics type="attached"><topic id="1qpc5ee298p2sqeqbinpca46b7" modified-by="bruce" timestamp="1503058545466"><title svg:width="500">Bitte versuchen Sie, diese Datei mit XMind 8 Update 3 oder später zu öffnen.</title></topic></topics></children></topic><topic id="4dmes10uc19pq7enu8sc4bmvif" modified-by="bruce" timestamp="1503058545473"><title svg:width="500">Ce fichier ne peut pas ouvert normalement, veuillez le rédiger et sauvegarder, sinon le fichier sera perdu en permanence. </title><children><topics type="attached"><topic id="5f0rivgubii2launodiln7sdkt" modified-by="bruce" timestamp="1503058545476"><title svg:width="500">Vous pouvez essayer d'ouvrir avec XMind 8 Update 3 ou avec une version plus récente.</title></topic></topics></children></topic><topic id="10pn1os1sgfsnqa8akabom5pej" modified-by="bruce" timestamp="1503058545481"><title svg:width="500">파일을 정상적으로 열 수 없으며, 수정 및 저장하지 마십시오. 그렇지 않으면 파일의 내용이 영구적으로 손실됩니다!</title><children><topics type="attached"><topic id="0l2nr0fq3em22rctapkj46ue58" modified-by="bruce" timestamp="1503058545484"><title svg:width="500">XMind 8 Update 3 또는 이후 버전을 사용하여</title></topic></topics></children></topic></topics></children><extensions><extension provider="org.xmind.ui.map.unbalanced"><content><right-number>-1</right-number></content></extension></extensions></topic><title>Sheet 1</title></sheet></xmap-content>`;

const PACKAGE_MAP = {
  MANIFEST: { NAME: 'manifest.json', TYPE: 'json' },
  CONTENT_JSON: { NAME: 'content.json', TYPE: 'json'},
  CONTENT_XML: { NAME: 'content.xml', TYPE: 'xml'},
  METADATA: { NAME: 'metadata.json', TYPE: 'json'}
};

export interface DumperOptions {
  workbook: Workbook;
}

export class Dumper {
  private workbook: Workbook;

  constructor(protected options: DumperOptions = <DumperOptions>{}) {
    if (!(options.workbook instanceof Workbook)) {
      throw new Error('The instance of workbook is required');
    }
    this.workbook = options.workbook;
  }

  /**
   * @description dumping an object that contains the pair of $filename: $value
   * @return {Array} Array<{filename: string, value: any}>
   */
  public dumping() {
    return []
      .concat(this.json)
      .concat(this.xml)
      .concat(this.manifest)
      .concat(this.metadata);
  }

  private wrap(name: string, value: any) {
    return {filename: name, value};
  }

  /**
   * @description metadata.json
   *
   */
  get metadata() {
    return this.wrap(PACKAGE_MAP.METADATA.NAME, '{}');
  }

  /**
   * @description manifest.json
   */
  get manifest() {
    const value = '{"file-entries":{"content.json":{},"metadata.json":{}}}';
    return this.wrap(PACKAGE_MAP.MANIFEST.NAME, value);
  }

  /**
   * @description content.json
   */
  get json() {
    const value = this.workbook.toString();
    return this.wrap(PACKAGE_MAP.CONTENT_JSON.NAME, value);
  }

  /**
   * @description content.xml
   */
  get xml() {
    return this.wrap(PACKAGE_MAP.CONTENT_XML.NAME, XMLContents);
  }
}

