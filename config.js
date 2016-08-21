'use strict';

var fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

process.env['overlay_document_data_storage_port'] = config['port'];
process.env['overlay_document_data_storage_couchdb_server'] = config['couchdb'];
process.env['overlay_document_data_storage_overlay_rules'] = config['overlay_rules'];
