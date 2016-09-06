'use strict';

const express = require('express'),
    router = express.Router(),
    couchdb = require('nano')(process.env.ODDS_COUCHDB_SERVER),
    db = couchdb.use(process.env.ODDS_DB),
    response = require('./response');

router.get('/:key', function (req, res) {
    var searchkey = req.params.key+"-v",
        qs = (req.query.rev)? {rev: req.query.rev} : {};

    qs = Object.assign(qs, {
        start_key_doc_id: searchkey,
        include_docs: true
    });

    db.list(qs, function(err, body) {
        if (err) {
            return response.send(res,  500, err.message);
        }

        if (!body.length) {
            var data = Object.assign(JSON.parse(process.env.ODDS_DEFAULT_CONFIG), {
                _id: searchkey+"1",
                updated_at: new Date().getTime()
            });

            response.send(res,  200, data);
            db.insert(data);

            return;
        }

        var latest = body[0];
        for (var index in body.rows) {
            if (latest.updated_at < body.rows[index]) {
                latest = body.rows[index];
            }
        }

        response.send(res, 200, latest);
    });
});

router.put('/:key', function (req, res) {
    const key = req.params.key,
        data = req.body.data,
        _rev = req.body._rev;

    if (!key) {
        return response.send(res, 400, "Key does not set");
    }

    if (!isValid(key)) {
        return response.send(res, 400, "Invalid Key");
    }

    db.get(key, function (err, body) {
        if (err) {
            return response.send(res, 500, err.message);
        }

        var latestData = {};
        if ("undefined" === typeof body) {
            latestData = process.env.ODDS_DEFAULT_CONFIG;
        } else {

            if (!_rev) {
                return response.send(res, 400, "_rev setting does not set");
            }

            if ("object" === typeof body) {
                latestData = body;
            } else {
                latestData = body[0];
                body.each(function (key, value) {
                    if (latestData.updated_at < value.updated_at) {
                        latestData = value;
                    }
                });
            }
        }

        var mergedData = Object.assign(latestData, data);
        mergedData['_rev'] = _rev;
        mergedData['updated_at'] = new Date().getTime();

        db.insert(mergedData, function (err, body, header) {
            if (err) {
                return response.send(res, 500, err.message);
            }

            return response.send(res, 200, 'update done', {"_rev": body.rev});
        });

    });
});

module.exports = router;

function isValid(id) {
    return true;
}