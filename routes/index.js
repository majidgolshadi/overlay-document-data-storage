'use strict';

const express = require('express'),
    router = express.Router(),
    couchdb = require('nano')(process.env.ODDS_COUCHDB_SERVER),
    db = couchdb.use(process.env.ODDS_DB),
    response = require('./response');

router.get('/:username', function (req, res) {
    const qs = (req.query.rev)? {rev: req.query.rev} : {};

    db.get(req.params.username, qs, function(err, body) {
        if (err) {
            return response.send(res,  200, JSON.parse(process.env.ODDS_DEFAULT_CONFIG));
        }

        response.send(res, 200, body);
    });
});

router.put('/', function (req, res) {
    const username = req.body.username,
        data = req.body.config,
        _rev = req.body._rev;

    if (!username) {
        return response.send(res, 400, "username does not set");
    }

    if (!_rev) {
        return response.send(res, 400, "_rev setting does not set");
    }

    db.get(username, function (err, body) {
        if (err) {
            return response.send(res, 200, 'update done');
        }

        var mergedData = Object.assign(body, data);
        mergedData['_rev'] = _rev;

        db.insert(mergedData, function (err, body, header) {
            if (err) {
                return response.send(res, 500, err.message);
            }

            return response.send(res, 200, 'update done');
        });

    });
});

module.exports = router;
