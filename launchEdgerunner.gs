/**
 * Returns the contextual add-on data that should be rendered for
 * the current e-mail thread. This function satisfies the requirements of
 * an 'onTriggerFunction' and is specified in the add-on's manifest.
 *
 * @param {Object} event Event containing the message ID and other context.
 * @returns {Card[]}
 */
function launchEdgerunner(event) {
  var card = CardService.newCardBuilder();

  var message = getCurrentMessage(event);

  var header = CardService.newCardHeader();

  header.setImageUrl(
    "https://i.ibb.co/CnHs7jN/cyperbunk-envelope-removebg-preview.png"
  );

  header.setTitle("<b>Smart inbox. Smarter you.</b>");

  // Summary Section
  var summarySection = CardService.newCardSection();

  var action = CardService.newAction()
      .setFunctionName("getKeyPoints")
      .setParameters({message: message.getPlainBody()});
      
  var keyPointsButton = CardService.newTextButton()
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setText('Extract Key Points')
      .setBackgroundColor('#7A04EB')
      .setOnClickAction(action);

  summarySection.addWidget(keyPointsButton);
  card.addSection(summarySection);

  // Button Section
  var buttonSection = getButtonSection();

  card.addSection(buttonSection);
  card.setHeader(header);

  return [card.build()];
}

function createDraft(event) {
  var message = getCurrentMessage(event);
  var messagePlainTextNoThread = stripThreads(message.getPlainBody());
  var response = fetchFromPrompt(
    "Suggest a " + getLength() + " and " + getSentiment() + " to this email sent to me: " + messagePlainTextNoThread + " \n\n###\n\n"
  );
  var draft = message.createDraftReply(response);
  return CardService.newComposeActionResponseBuilder()
    .setGmailDraft(draft)
    .build();
}

function getButtonSection() {
  var buttonSection = CardService.newCardSection();

  setSentiment('highly interested response')
  var sentimentDropDown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Sentiment")
    .setFieldName("sentimentSelection")
    .addItem("Interested", "highly interested response", false)
    .addItem("Thankful", "thankful response", false)
    .addItem("Seeking Clarification", "response seeking  more clarification", false)
    .addItem("Learn More", "response asking for more information", false)
    .addItem("Dismiss Kindly", "response kindly stating disinterest", false)
    .setOnChangeAction(CardService.newAction().setFunctionName("handleSentimentChange"));

  buttonSection.addWidget(sentimentDropDown)

  setLength('medium length')
  var lengthSelection = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle("Length")
    .setFieldName("lengthSelection")
    .addItem("Short", "very short", false)
    .addItem("Medium", "medium length", true)
    .addItem("Long", "very long", false)
    .setOnChangeAction(CardService.newAction().setFunctionName("handleLengthChange"));

  buttonSection.addWidget(lengthSelection)

  var action = CardService.newAction()
      .setFunctionName("createDraft")
  var button = CardService.newTextButton()
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setText('Generate Draft')
      .setBackgroundColor('#7A04EB')
      .setComposeAction(action, CardService.ComposedEmailType.REPLY_AS_DRAFT);

  buttonSection.addWidget(button);
  buttonSection.addWidget(CardService.newDivider());

  return buttonSection;
}

function stripThreads(messagePlainBody) {
  var regexThread = messagePlainBody.match(/On.*at.*<.*>/gi);
  var index = regexThread
    ? messagePlainBody.indexOf(regexThread[0])
    : messagePlainBody.length;
  return messagePlainBody.substring(0, index);
}

function handleSentimentChange(event) {
  setSentiment(event.formInput['sentimentSelection'])
}

function setSentiment(sentiment) {
  PropertiesService.getScriptProperties().setProperty('SENTIMENT', sentiment)
}

function getSentiment() {
  return PropertiesService.getScriptProperties().getProperty('SENTIMENT')
}

function handleLengthChange(event) {
  setLength(event.formInput['lengthSelection'])
}

function setLength(length) {
  PropertiesService.getScriptProperties().setProperty('LENGTH', length)
}

function getLength() {
  return PropertiesService.getScriptProperties().getProperty('LENGTH')
}

function getKeyPoints(event) {
  var messagePlainBody = event.parameters.message;
  var messagePlainTextNoThread = stripThreads(messagePlainBody);
  var response = fetchFromPrompt(
    "Highlight the key points of the following email and start them with -: " +
      messagePlainTextNoThread
  );

  var card = CardService.newCardBuilder();
  var header = CardService.newCardHeader();
  header.setTitle("<b>Smart inbox. Smarter you.</b>");
  card.setHeader(header);

  var summarySection = CardService.newCardSection();

  summarySection.addWidget(
    CardService.newTextParagraph().setText("<b>Key Points</b>")
  );

  summarySection.addWidget(CardService.newTextParagraph().setText(response));

  card.addSection(summarySection);

  return [card.build()];
}
