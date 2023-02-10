// OpenAI Functions
function fetchFromPrompt(prompt) {
  var data = {
      'model': 'text-davinci-003',
      'prompt': prompt,
      'max_tokens': 256,
      'temperature': 0,
      'n': 1,
    };

  var options = {
    'method' : 'post',
    'headers': {
      'Authorization': 'Bearer <KEY>'
    },
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  var json = JSON.parse(UrlFetchApp.fetch('https://api.openai.com/v1/completions', options).getContentText());
  return json.choices[0].text.trim();
}


// General Functions

/**
 * Retrieves the current message given an action event object.
 * @param {Event} event Action event object
 * @return {Message}
 */
function getCurrentMessage(event) {
  var accessToken = event.messageMetadata.accessToken;
  var messageId = event.messageMetadata.messageId;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  return GmailApp.getMessageById(messageId);
}


