var builder = require('botbuilder');

exports.displayBotCard = function (session) {
    var attachment = [];
    
    // Create a herocard with name, images and hyperlink.
    var card = new builder.HeroCard(session)
        .title("I'm the Chat Bot from Contoso bank.")
        .subtitle("Based on Microsoft bot framework service.")
        .images([
            builder.CardImage.create(session, "http://botmywebapp.azurewebsites.net/bot.png")])
        .buttons([
            builder.CardAction.openUrl(session, "https://dev.botframework.com/", 'About Me')
        ]);
    attachment.push(card);

    //Displays bot hero card carousel in chat box 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}