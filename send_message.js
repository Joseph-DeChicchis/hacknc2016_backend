const request = require('request')

module.exports = {

  // quickReplies
quickReplies: function (recipientId, messageText, replies) {
    console.log("quickReplies")
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
},

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
generic: function (recipientId, link, name, subname) {
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
          title: name,
          subtitle: subname,
          item_url: link,
          //image_url: "http://messengerdemo.parseapp.com/img/rift.png",
          buttons: [{
            type: "web_url",
            url: link,
            title: "Apply Now!"
          }],
        }]
      }
    }
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

      console.log("Successfully sent message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      //console.error(response);
      //console.error(error);
    }
  });
}
