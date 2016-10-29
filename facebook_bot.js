var page_token = ("EAAS6MQj6ImsBAFqdLD5JjxbS7VDgH3rz6tUKApMXLWQiWIflDn1xWDmbnw7m9clXYWaG5UAs1u1cLYDubBwf4T3Tzr0KExy7HhyE546LSGSlcm4RQpCtZCI0HwgLGQ4UhtucC3EKZAVSqk76JRiWV6AIwkDGKTqWfHrcyWeAZDZD");
var verify_token = ("joseph");
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);

//////////////////////////////////////////////////
var Botkit = require('./lib/Botkit.js');
var controller = Botkit.facebookbot({
    debug: false,
    access_token: page_token,
    verify_token: verify_token
});

var bot = controller.spawn({

});

controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {
    bot.reply(message, 'Hello.');
});

// If you wanted your bot to respond to additional "hears" such as Go Heels
// you could do that below using the same syntax from above.


//added to stop the debug tick remarks in console
controller.on('tick', function(bot, event) {});

controller.setupWebserver(process.env.port || 5000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');

    });
});
