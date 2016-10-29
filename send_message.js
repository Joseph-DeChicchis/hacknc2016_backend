const request = require('request')

module.exports = {
  // Send text message
  text: function (recipientId, messageText) {
    var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);

  },

  // Send generic message
  generic: function (recipientId) {
    var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
},

  // quickReplies
  quickReplies: function (recipientId, messageText, replies) {
    var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      quick_replies: replies
    }
  };

  callSendAPI(messageData);
  }

  // Send another message
};

const token = "EAAS6MQj6ImsBAP7h2uGf18YSBnQkRZCnjQzQpZCKGZCfuZB91WUcec62tThIdT5AeQXc7LfMmrZCOMZAosdb5a2RAj1LD0KL4Ri7X7kSQGVdmpiobQeAZB4ZB0lbXgM8sBMeSvq0L6JGFaXYNmubjojtxZAZAzNVQeawnAQtQyQ63izwZDZD"

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      //console.error(response);
      //console.error(error);
    }
  });
}
