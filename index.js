'use strict'

var send_message = require('./send_message');
var company_search = require('./company_search');

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const app = express();

var sessions = {};	// store session information
var citiesArray = [];

app.set('port', (process.env.PORT || 5000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// index
/*
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot');
});*/

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
				"fields": [],
				"languages": [],
				"platforms": [],
				"suggested": false
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
			//addFieldtoSender
			//categories = new String[]{"software", "hardware", "design", "finance", "real estate"
			//, "entertainment", "travel"};

			if (textContains(text, ["software"])) {
				addFieldtoSender(sender, "software");
				dataLogged = true;
			}
			if (textContains(text, ["hardware"])) {
				addFieldtoSender(sender, "hardware");
				dataLogged = true;
			}
			if (textContains(text, ["design"])) {
				addFieldtoSender(sender, "design");
				dataLogged = true;
			}
			if (textContains(text, ["finance"])) {
				addFieldtoSender(sender, "finance");
				dataLogged = true;
			}
			if (textContains(text, ["real estate"])) {
				addFieldtoSender(sender, "real estate");
				dataLogged = true;
			}
			if (textContains(text, ["entertainment"])) {
				addFieldtoSender(sender, "entertainment");
				dataLogged = true;
			}
			if (textContains(text, ["travel"])) {
				addFieldtoSender(sender, "travel");
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

			if (dataLogged == true && suggestToSender(sender, false) == false) {
				randomMoreInfoResponse(sender);
			}
			else {
				if (text === "help") {
					send_message.text(sender, "So you need help?\n\nWell, all you have to do is type out what kind of internship you're interested in, and I'm smart enough to understand!\n\nYou can tell me about the size, location, languages used and more about your perfect internship!");
				}
				else if (text === "clear") {
					sessions[sender] = {
						"locations": [],
						"roles": [],
						"size": "any",
						"fields": [],
						"languages": [],
						"platforms": [],
						"suggested": false
					};

					send_message.text(sender, "OK. I forgot everything you told me. What kind of internship are you looking for?");
				}
				else if (text == "suggest") {
					suggestToSender(sender, true)
				}
				else if (textArrayContains(textArray, ["hi", "yo", "hello"])) {
					randomHiResponse(sender);
				}
				else {
					send_message.text(sender, "Sorry, I don't know what you mean by \"" + text.substring(0, 200) + "\"");
					wait(250);
					if (sessions[sender]["locations"].length == 0) { send_message.text(sender, "What city do you want to intern in?"); }
					else if (sessions[sender]["roles"].length == 0) { send_message.text(sender, "What position do you want to intern for? (ex. software engineer)"); }
					else if (sessions[sender]["size"] == "") { send_message.text(sender, "What size company do you want to work for?"); }
					else if (sessions[sender]["fields"].length == 0) { send_message.text(sender, "What industry are you interested in? (ex. software, hardware)"); }
					else if (sessions[sender]["languages"].length == 0) { send_message.text(sender, "What programming languages do you know?"); }
					else if (sessions[sender]["platforms"].length == 0) { send_message.text(sender, "Are you interested in web, mobile, or backend?"); }
				}

				/*else if (text === 'generic') {
					send_message.generic(sender);
				}*/

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
					send_message.text(sender, "Welcome! I can help you find the perfect internship for you.\n\nSay \"help\" at any time for instructions\n\nSay \"suggest\" at any time to get results\n\nSay \"clear\" at any time restart\n\nWhat kind of internship are you looking for?");
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

		suggestToSender(sender, false);
	}
	res.sendStatus(200);
})

function suggestToSender(sender, force) {
	if (checkCanSuggest(sender) == true || force) {
		let session = sessions[sender];
		if (session["suggested"] == false || force) {
			session["suggested"] = true;
			send_message.text(sender, "OK. Let me search for internships that match your interests...");

			wait(250);

			var companies = company_search.findCompanies(session["size"],session["languages"],session["roles"],session["platforms"],session["locations"],session["fields"]);

			wait(500);

			send_message.text(sender, "Here are the top 5 internships that match your interests! Good luck!");

			for(var j=0;j<5;j++) {
				//recipientId, link, name, subname
				wait(250);
				send_message.generic(sender,companies[j][2],companies[j][0],"")
			}
		}

		return true
	}

	return false
}

function checkCanSuggest(sender) {
	console.log("Session: " + JSON.stringify(sessions[sender]))
	if (sessions[sender]["locations"].length == 0) { return false }
	if (sessions[sender]["roles"].length == 0) { return false }
	if (sessions[sender]["size"] == "") { return false }
	if (sessions[sender]["fields"].length == 0) { return false }
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

function addFieldtoSender(sender, field) {
	let userFields = sessions[sender]["fields"];
	console.log("userFields: " + userFields);
	if (userFields.length == 0) {
		sessions[sender]["fields"] = [field];
	}
	else if (userFields.arrayContains(field) == false) {
		sessions[sender]["fields"] = userFields.concat([field]);
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

	var languagePresent = false

	for(var i=0;i<citiesArray.length;i++) {
		if (text.includes(citiesArray[i].toLowerCase())) {
			addCity(sender, citiesArray[i].toLowerCase());
			languagePresent = true;
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

function randomHiResponse(sender) {
	let randomWords = ["Hi there!", "Yo", "I'm here to help", "I got your back!"]
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

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));

	fs.readFile("cities.txt", 'utf8', function (err,data) {
  	if (err) {
    	return console.log(err);
  	}
		citiesArray = data.split("\n");
	});

	//size, languages, roles, platforms, locations
	//company_search.findCompanies("large",["java", "python", "c++"],["SE"],["mobile"],["mountain view, new york, seattle"]);
});

// api code

/*app.get("/api", function(request, response, next) {
		response.json({ message: 'hooray! welcome to our api!' });
		//var user_id = req.bodyParser.id;
    //var token = req.body.token;
    //var geo = req.body.geo;
		console.log(request.query("greeting"));
		console.log(request.bodyParser.greeting);
});*/

app.post('/api/', function (req, res) {
  console.log("api call recieved");
	//let messaging_events = req.body.entry[0].messaging;
	var user_preferences = req.body;
	console.log(user_preferences);
	var companies = company_search.findCompanies(user_preferences["size"],user_preferences["languages"],user_preferences["roles"],user_preferences["platforms"],user_preferences["locations"],user_preferences["fields"]);
	var results = {
		"compnay1" : [companies[0][0],companies[0][2]],
		"compnay2" : [companies[1][0],companies[1][2]],
		"compnay3" : [companies[2][0],companies[2][2]],
		"compnay4" : [companies[3][0],companies[3][2]],
		"compnay5" : [companies[4][0],companies[4][2]]
	}
	var array = JSON.stringify(results);
	res.send({redirect: '/results?data=' + encodeURIComponent(array)});
});

// static website code

app.get("/", function(request, response, next) {
    console.log("Main page")
    response.sendFile(__dirname + '/public/index.html')
});

app.get("/theme.css", function(request, response, next) {
    console.log("Main page")
    response.sendFile(__dirname + '/public/theme.css')
});

app.get("/focus.js", function(request, response, next) {
    console.log("Main page")
    response.sendFile(__dirname + '/public/focus.js')
});

app.get("/SourceSansPro-Bold.otf", function(request, response, next) {
    console.log("Main page")
    response.sendFile(__dirname + '/public/SourceSansPro-Bold.otf')
});

app.get("/SourceSansPro-ExtraLight.otf", function(request, response, next) {
    console.log("Main page")
    response.sendFile(__dirname + '/public/SourceSansPro-ExtraLight.otf')
});

app.get("/SourceSansPro-Light.otf", function(request, response, next) {
    console.log("Main page")
    response.sendFile(__dirname + '/public/SourceSansPro-Light.otf')
});

app.get("/*", function(request, response, next) {
    console.log("404 not found")
    response.sendFile(__dirname + '/public/404.html')
});
