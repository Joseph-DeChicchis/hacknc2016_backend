'use strict'

var send_message = require('./send_message');

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'joseph') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
  console.log("message recieved")
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				send_message.generic(sender)
				continue
			}
			send_message.text(sender, "Sorry, I don't know what you meant by \"" + text.substring(0, 200) + "\"")
		}
		if (event.postback) {
			let callback = JSON.stringify(event.postback)
			console.log("Postback: " + callback)
			console.log("callback: " + event.postback["payload"])
			if (callback["payload"] == "GET_STARTED") {
					send_message.text(sender, "Welcome {{first_name}}! I can help you find the perfect internship for you.")
					continue
			}
			send_message.text(sender, "Postback received: "+callback.substring(0, 200))
			continue
		}
	}
	res.sendStatus(200)
})

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

// static website code

app.get("/*", function(request, response, next) {
    console.log("404 not found");
    response.sendFile(__dirname + '/public/404.html')
});
