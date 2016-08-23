'use strict';

var fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

process.env['OVERLAY_DOCUMENT_DATA_STORAGE_PORT'] = config['port'];
process.env['OVERLAY_DOCUMENT_DATA_STORAGE_COUCHDB_SERVER'] = config['couchdb'];
