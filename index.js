'use strict';

require('./config.js');

const seed = require('./app.js');

seed.init.then(function (app) {

    app.api.get('/', function (req, res) {
        app.db.get('rabbit', {revs_info: true}, function(err, body) {

            if (err) {
                return res.status(500).send(err.message);
            }

            res.status(200).send(body);
        });
    });

    app.api.get('/:rev', function (req, res) {
        app.db.get('rabbit', { rev: req.params.rev }, function(err, body) {

            if (err) {
                return res.status(500).send(err.message);
            }

            res.status(200).send(body);
        });
    });

    app.api.put('/', function (req, res) {
        const data = req.body.config,
            _rev = req.body._rev;

        if (!_rev) {
            return res.status(400).send("_rev setting does not set");
        }

        app.db.get('rabbit',function (err, body) {
            if (err) {
                return res.status(500).send(err.message);
            }

            var mergedData = Object.assign(body, data);
            mergedData['_rev'] = _rev;

            app.db.insert(mergedData, function (err, body, header) {
                if (err) {
                    return res.status(500).send(err.message);
                }

                return res.status(200).send('Update Done');
            });

        });
    });

});
