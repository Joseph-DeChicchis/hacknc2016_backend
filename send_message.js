module.exports = {
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
  bar: function () {
    // whatever
  }
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
      console.error(response);
      console.error(error);
    }
  });
}
