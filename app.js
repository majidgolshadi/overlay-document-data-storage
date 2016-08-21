'use strict';

var express = require('express'),
    app = new express();

require('./config.js');

app.get('/', function (req, res) {
    res.send("some data to show to user");
});

app.listen(proccess.env.overlay_document_data_storage_port);
