'use strict';

const events = require('events'),
    eventEmitter = new events.EventEmitter();

eventEmitter.on('response', function(res, statusCode, msg, result){
    var response = {};

    response["status"] = "error";
    if (statusCode < 300) {
        response["status"] = "success";
    }

    if (result) {
        response["result"] = result;
    }

    if (typeof msg == 'string') {
        response["message"] = msg;
    } else {
        response["result"] = msg;
    }

    return res.status(statusCode).send(response);
});

function Response() {
}

Response.prototype.send = function (res, statusCode, msg, result) {
    eventEmitter.emit('response', res, statusCode, msg, result);
};

module.exports = new Response();
