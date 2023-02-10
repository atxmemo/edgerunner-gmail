    /**
     * Compose trigger function that fires when the compose UI is
     * requested. Builds and returns a compose UI for inserting images.
     *
     * @param {event} e The compose trigger event object. Not used in
     *         this example.
     * @return {Card[]}
     */
    function launchCompose(e) {
      return [buildComposeCard()];
    }

    /**
     * Build a card to display interactive buttons to allow the user to
     * update the body
     *
     * @return {Card}
     */
    function buildComposeCard() {

      var card = CardService.newCardBuilder();
      var cardSection = CardService.newCardSection().setHeader('Crafting Professional Email Drafts with AI');

      cardSection.addWidget(
        CardService.newTextInput()
        .setFieldName("textInput")
        .setTitle("Give us some details on the email you'd like to generate")
        .setHint('Example: ' + getRandomHint())
      )

      cardSection.addWidget(
          CardService.newTextButton()
              .setText('Generate Email!')
              .setOnClickAction(CardService.newAction()
                  .setFunctionName('applyUpdateBodyAction')
                  .setLoadIndicator(CardService.LoadIndicator.SPINNER)));

      return card.addSection(cardSection).build();
    }

    /**
     * Updates the body field of the current email when the user clicks
     * on "Update body" in the compose UI.
     *
     * Note: This is not the compose action that builds a compose UI, but
     * rather an action taken when the user interacts with the compose UI.
     *
     * @return {UpdateDraftActionResponse}
     */
    function applyUpdateBodyAction(e) {
      // Get the new body field of the email.
      var prompt = e['formInput']['textInput']
      var generatedEmail = fetchFromPrompt('Write an email with a subject for the following prompt: ' + prompt)
      var subject = getSubject(generatedEmail)
      var body = getBody(subject, generatedEmail)

      var response = CardService.newUpdateDraftActionResponseBuilder()
      .setUpdateDraftBodyAction(CardService.newUpdateDraftBodyAction()
          .addUpdateContent(body, CardService.ContentType.MUTABLE_HTML)
          .setUpdateType(CardService.UpdateDraftBodyType.INSERT_AT_START))
      .setUpdateDraftSubjectAction(CardService.newUpdateDraftSubjectAction()
      .addUpdateSubject(subject))
      .build();
      return response;
    }

  function getSubject(generatedEmail) {
    var regex = generatedEmail.match(/Subject: .*/gi)
    var index = regex[0].indexOf(':')
    return regex[0].substring(index + 2)
  }

  function getBody(subject, generatedEmail) {
    var index = generatedEmail.indexOf(subject) + subject.length + 2
    return generatedEmail.substring(index)
  }

  function getRandomHint() {
    items = [
      "Create an email inviting a new customer to join our service",
      "Compose an email to send a weekly newsletter to our subscribers",
      "Generate an email to announce a new product launch",
      "Construct an email to notify customers about a sale",
      "Create an email to introduce a new team member",
      "Compose an email to thank customers for their loyalty",
      "Generate an email to promote a customer loyalty program",
      "Construct an email to share customer testimonials",
      "Create an email to remind customers of upcoming events",
      "Compose an email to inform customers of changes to our services",
      "Generate an email to solicit feedback from customers",
      "Construct an email to thank customers for their feedback",
      "Create an email to announce the release of a new feature",
      "Compose an email to inform customers of new pricing",
      "Generate an email to inform customers of a new promotion",
      "Construct an email to inform customers of a data breach",
      "Create an email to remind customers of their account details",
      "Compose an email to inform customers of a new payment option",
      "Generate an email to thank customers for their purchase",
      "Construct an email to alert customers of a security update",
      "Create an email to notify customers of a new product update",
      "Compose an email to notify customers of an upcoming webinar",
      "Generate an email to notify customers of a site downtime",
      "Construct an email to remind customers of an upcoming deadline",
      "Create an email to inform customers of a new customer service feature",
      "Compose an email to let customers know their order has shipped",
      "Generate an email to notify customers of a new blog post",
      "Construct an email to inform customers of a new app launch",
      "Create an email to ask customers for a product review",
      "Compose an email to solicit customer referrals",
      "Generate an email to remind customers of an upcoming expiration date",
      "Construct an email to inform customers of a contest or giveaway",
      "Create an email to ask customers to join a webinar",
      "Compose an email to remind customers of an upcoming renewal",
      "Generate an email to inform customers of an upcoming holiday sale",
      "Construct an email to inform customers of webinar recordings",
      "Create an email to notify customers of a new customer service policy",
      "Compose an email to invite customers to a virtual event",
      "Generate an email to inform customers of a new partnership",
      "Construct an email to inform customers of a new support article",
      "Create an email to remind customers of a product they purchased",
      "Compose an email to promote a new feature or update",
      "Generate an email to notify customers of an upcoming maintenance window",
      "Construct an email to thank customers for attending a webinar",
      "Create an email to alert customers of a data privacy policy change",
      "Compose an email to thank customers for their support",
      "Generate an email to solicit customer feedback on a new feature",
      "Construct an email to inform customers of a system outage",
      "Create an email to announce a new integration or API",
      "Compose an email to remind customers of a special offer",
      "Generate an email to inform customers of a new job posting",
      "Construct an email to let customers know about a new blog post"
    ]
    return items[Math.floor(Math.random()*items.length)]
  }
