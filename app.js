'use strict';

require('./config.js');

const expressjs = require('express'),
    bodyParser = require('body-parser');

const express = new expressjs(),
    DB_NAME = 'test_db';

function Application() {
    var api = undefined,
        db = undefined;
}

Application.prototype.init = new Promise(function (resolve, reject) {

    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({ extended: true }));

    const couchdb = require('nano')(
        process.env.OVERLAY_DOCUMENT_DATA_STORAGE_COUCHDB_SERVER
    );

    couchdb.db.create(DB_NAME, function (err) {
        express.listen(process.env.OVERLAY_DOCUMENT_DATA_STORAGE_PORT);

        Application.api = express;
        Application.db = couchdb.use(DB_NAME);

        resolve(Application);
    });
});

module.exports = new Application();
