'use strict'

var send_message = require('./send_message');

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var sessions = {};	// store session information

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

		if (sessions[sender] == null) {

			sessions[sender] = {
				"locations": [],
				"roles": [],
				"size": "",
				"field": [],
				"languages": [],
				"platforms": []
			}
		}
		//randomResponse(sender)
		if (event.message && event.message.text) {
			let text = event.message.text

			if (text === 'Generic') {
				send_message.generic(sender)
				continue
			}

			send_message.text(sender, "Sorry, I don't know what you meant by \"" + text.substring(0, 200) + "\"")
			continue
		}
		if (event.postback) {
			//let callback = JSON.stringify(event.postback)
			//console.log("Postback: " + callback)
			//console.log("callback: " + event.postback["payload"])
			let payload = event.postback["payload"];
			console.log("Payload: "+ payload);
			if (payload == "GET_STARTED") {
					send_message.quickReplies(sender, "Welcome! I can help you find the perfect internship for you.\n\nWhat kind of internship are you looking for?", [{"content_type":"text", "title":"Software Engineer", "payload": "SE"},{"content_type":"text", "title":"QA Engineer", "payload": "QA"}])
			}
			else if (payload == "SE") {
				addRoletoSender(sender, "SE")
				send_message.text(sender, "Got it. Any other interests?")
			}
			else if (payload == "PM") {
				addRoletoSender(sender, "PM")
				send_message.text(sender, "Got it. Any other interests?")
			}
			else if (payload == "QA") {
				addRoletoSender(sender, "QA")
				send_message.text(sender, "Got it. Any other interests?")
			}
			//send_message.text(sender, "Postback received: "+callback.substring(0, 200))
		}

		if (checkCanSuggest(sender) == true) {

		}
	}
	res.sendStatus(200)
})

function checkCanSuggest(sender) {
	console.log("Session: " + JSON.stringify(sessions[sender]));
	if (sessions[sender]["locations"].length == 0) { return false }
	if (sessions[sender]["roles"].length == 0) { return false }
	if (sessions[sender]["size"] == "") { return false }
	if (sessions[sender]["field"].length == 0) { return false }
	if (sessions[sender]["languages"].length == 0) { return false }
	if (sessions[sender]["platforms"].length == 0) { return false }

	return true
}

function addRoletoSender(sender, role) {
	if (sessions[sender][roles].indexOf(role) == -1) {
		sessions[sender][roles] = sessions[sender][role].push(role)
	}
}

function randomResponse(sender) {
	let randomWords = ["OK", "I understand", "Let me see what I can do...", "I'll try my best to help you", "I got your back!", "Awesome!"]
	send_message.text(sender, randomWords[Math.floor(Math.random() * randomWords.length)])
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

// static website code

app.get("/*", function(request, response, next) {
    console.log("404 not found");
    response.sendFile(__dirname + '/public/404.html')
});
