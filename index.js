'use strict'

var send_message = require('./send_message');

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const app = express();

var sessions = {};	// store session information

app.set('port', (process.env.PORT || 5000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot');
});

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'joseph') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token');
});

// to post data
app.post('/webhook/', function (req, res) {
  console.log("message recieved");
	let messaging_events = req.body.entry[0].messaging;
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i];
		let sender = event.sender.id;

		if (sessions[sender] == null) {

			sessions[sender] = {
				"locations": [],
				"roles": [],
				"size": "any",
				"field": [],
				"languages": [],
				"platforms": []
			};
		}

		if (event.message && event.message.text) {
			let text = event.message.text.toLowerCase();
			let textArray = event.message.text.toLowerCase().split(" ");

			var dataLogged = false;

			// Look for roles
			if (textArrayContains(textArray, ["software", "ios", "web", "mobile", "mac", "windows", "linux", "ai"]) || textContains(text, ["artificial intelligence", "machine learning"])) {
				addRoletoSender(sender, "SE");
				dataLogged = true;
			}
			if (textContains(text, ["quality"])) {
				addRoletoSender(sender, "QA");
				dataLogged = true;
			}
			if (textArrayContains(textArray, ["ux", "design", "ui"]) || textContains(text, ["user interface", "user experience"])) {
				addRoletoSender(sender, "UI");
				dataLogged = true;
			}
			if (textArrayContains(textArray, ["pm"]) || textContains(text, ["project management", "product management"])) {
				addRoletoSender(sender, "PM");
				dataLogged = true;
			}
			if (textArrayContains(textArray, ["statistics"]) || textContains(text, ["data analy", "big data"])) {
				addRoletoSender(sender, "DA");
				dataLogged = true;
			}

			// Look for languages
			if (checkForLanguages(textArray, sender)) {
				dataLogged = true;
			}

			// Check for cities
			if (checkForCities(text, sender)) {
				dataLogged = true;
			}

			// Loook for size
			if (textArrayContains(textArray, ["small","medium","startup"])) {
				sessions[sender]["size"] = "medium";
				dataLogged = true;
			}
			else if (textArrayContains(textArray, ["large"]) || textContains(text, ["big company"])) {
				sessions[sender]["size"] = "large";
				dataLogged = true;
			}
			else if (textContains(text, ["any size"])) {
				sessions[sender]["size"] = "any";
				dataLogged = true;
			}

			// Look for platforms
			if (textArrayContains(textArray, ["ios", "android", "mobile"])) {
				addPlatformtoSender(sender, "mobile");
				dataLogged = true;
			}
			if (textArrayContains(textArray, ["backend", "database", "cloud"]) || textContains(text, ["data center"])) {
				addPlatformtoSender(sender, "backend");
				dataLogged = true;
			}
			if (textArrayContains(textArray, ["web", "html", "css", "javascript"])) {
				addPlatformtoSender(sender, "web");
				dataLogged = true;
			}
			if (textArrayContains(textArray, ["media", "design", "ux"]) || textContains(text, ["user interface"])) {
				addPlatformtoSender(sender, "media");
				dataLogged = true;
			}

			if (dataLogged == true) {
				randomMoreInfoResponse(sender);
			}
			else {
				if (text === "help") {
					send_message.text(sender, "So you need help?\n\nWell, all you have to do is type out what kind of internship you're interested in, and I'm smart enough to understand!\n\nYou can tell me about the size, location, languages used and more about your perfect internship!");
				}
				else if (text === 'generic') {
					send_message.generic(sender);
				}
				else {
					send_message.text(sender, "Sorry, I don't know what you meant by \"" + text.substring(0, 200) + "\"");
				}

				continue
			}
		}
		if (event.postback) {
			//let callback = JSON.stringify(event.postback)
			//console.log("Postback: " + callback)
			//console.log("callback: " + event.postback["payload"])
			let payload = event.postback["payload"];
			console.log("Payload: "+ payload);
			if (payload == "GET_STARTED") {
					//send_message.quickReplies(sender, "Welcome! I can help you find the perfect internship for you.\n\nWhat kind of internship are you looking for?", [{"content_type":"text", "title":"Software Engineer", "payload": "SE"},{"content_type":"text", "title":"PM", "payload": "PM"}])
					send_message.text(sender, "Welcome! I can help you find the perfect internship for you.\n\nSay \"help\" at any time for instructions\n\nWhat kind of internship are you looking for?");
			}
			else if (payload == "SE") {
				addRoletoSender(sender, "SE");
				randomMoreInfoResponse(sender);
			}
			else if (payload == "PM") {
				addRoletoSender(sender, "PM");
				randomMoreInfoResponse(sender);
			}
			//send_message.text(sender, "Postback received: "+callback.substring(0, 200))
		}

		if (checkCanSuggest(sender) == true) {

		}
	}
	res.sendStatus(200);
})

function checkCanSuggest(sender) {
	console.log("Session: " + JSON.stringify(sessions[sender]))
	if (sessions[sender]["locations"].length == 0) { return false }
	if (sessions[sender]["roles"].length == 0) { return false }
	if (sessions[sender]["size"] == "") { return false }
	if (sessions[sender]["field"].length == 0) { return false }
	if (sessions[sender]["languages"].length == 0) { return false }
	if (sessions[sender]["platforms"].length == 0) { return false }

	return true
}

function addRoletoSender(sender, role) {
	let userRoles = sessions[sender]["roles"];
	console.log("userRoles: " + userRoles);
	if (userRoles.length == 0) {
		sessions[sender]["roles"] = [role];
	}
	else if (userRoles.arrayContains(role) == false) {
		sessions[sender]["roles"] = userRoles.concat([role]);
	}
}

function addPlatformtoSender(sender, platform) {
	let userPlatforms = sessions[sender]["platforms"];
	console.log("userPlatforms: " + userPlatforms);
	if (userPlatforms.length == 0) {
		sessions[sender]["platforms"] = [platform];
	}
	else if (userPlatforms.arrayContains(platform) == false) {
		sessions[sender]["platforms"] = userPlatforms.concat([platform]);
	}
}

function checkForLanguages(textArray, sender) {
	let languages = ["c", "java", "javascript", "php", "python", "objective-c", "ruby", "perl", "c++", "c#", "swift", "sql", "haskell", "scala", "bash", "lua", "clojure", "assembly"]

	var languagePresent = false

	for(var i=0;i<languages.length;i++) {
		let language = languages[i]
		if (textArrayContains(textArray, [language])) {
			languagePresent = true
			addLanguage(sender, language)
		}
	}

	return languagePresent
}

function addLanguage(sender, language) {
	let userLanguages = sessions[sender]["languages"]
	console.log("userLanguages: " + userLanguages);
	if (userLanguages.length == 0) {
		sessions[sender]["languages"] = [language]
	}
	else if (userLanguages.arrayContains(language) == false) {
		sessions[sender]["languages"] = userLanguages.concat([language])
	}
}

function checkForCities(text, sender) {

	let data = fs.readFile('cities.txt', 'utf8')
	console.log("City data: " + data);
	let citiesArray = data.split("\n")
	var languagePresent = false
	for(var i=0;i<citiesArray.length;i++) {
		console.log("City: " + citiesArray[i].toLowerCase());
		if (text.includes(citiesArray[i].toLowerCase())) {
			addCity(sender, citiesArray[i].toLowerCase())
			languagePresent = true
		}
	}

	return languagePresent
}

function addCity(sender, city) {
	let userLocations = sessions[sender]["locations"]
	console.log("userLocations: " + userLocations);
	if (userLocations.length == 0) {
		sessions[sender]["locations"] = [city]
	}
	else if (userLocations.arrayContains(city) == false) {
		sessions[sender]["locations"] = userLocations.concat([city])
	}
}

function randomResponse(sender) {
	let randomWords = ["OK", "I understand", "Let me see what I can do...", "I'll try my best to help you", "I got your back!", "Awesome!"]
	send_message.text(sender, randomWords[Math.floor(Math.random() * randomWords.length)])
}

function randomMoreInfoResponse(sender) {
	let randomWords = ["Got it. Any other interests? If not, tell us other things about where you want to intern", "Great! Tell us more about what you're looking for", "Awesome! Anything else?", "Very cool. What else are you looking for?"]
	send_message.text(sender, randomWords[Math.floor(Math.random() * randomWords.length)])
}

Array.prototype.arrayContains = function(k) {
	for(var i=0;i<this.length;i++) {
		if(this[i] === k) {return true}
	}
  return false
}

function textContains(text,array) {
	var s = ""
	for(var i=0;i<array.length;i++) {
		if(text.includes(array[i])) {return true}
	}

	return false
}

function textArrayContains(textArray,array) {
	for(var i=0;i<array.length;i++) {
		if(textArray.arrayContains(array[i])) {return true}
	}

	return false
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));

	fs.readFile("cities.txt", 'utf8', function (err,data) {
  	if (err) {
    	return console.log(err);
  	}
  	console.log(data);
	});
});

// static website code

app.get("/*", function(request, response, next) {
    console.log("404 not found")
    response.sendFile(__dirname + '/public/404.html')
});
