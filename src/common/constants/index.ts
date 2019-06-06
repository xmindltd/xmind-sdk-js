/**
 * @description Zip files
 */
const PACKAGE_MAP = {
  MANIFEST: { NAME: 'manifest.json', TYPE: 'json' },
  CONTENT_JSON: { NAME: 'content.json', TYPE: 'json'},
  CONTENT_XML: { NAME: 'content.xml', TYPE: 'xml'},
  METADATA: { NAME: 'metadata.json', TYPE: 'json'},
  THUMBNAILS: {NAME: 'Thumbnails', TYPE: 'directory'},
  RESOURCES: { NAME: 'resources', TYPE: 'directory'}
};

export { PACKAGE_MAP };
