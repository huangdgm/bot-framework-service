var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getYelpEventData' in RestClient.js with 'displayEventCards' as callback to get list of events information
exports.displayEventCards = function getEventData(location, session){
    var url ='https://api.yelp.com/v3/events?location='+location+'&limit=5';
    var auth ='BRIcgJBZ7_gG4csSu9e3Yfdyto_2L0xiRL1sG4m6BMTv5QFLX7nNZuVCLSsoWJZ6rRoex4MUrbygnhYh1F_RKTHvbWHYr3OpPflVnK4RDr4hMNLXnvI1pgJNegUeWnYx';
    rest.getYelpEventData(url,auth,session,displayEventCards);
}

function displayEventCards(message, session) {
    var attachment = [];
    var eventsFound = JSON.parse(message);
    
    //For each event, add herocard with name, address, image and url in attachment
    for (var index in eventsFound.events) {
        var event = eventsFound.events[index];
        var name = event.name;
        var imageURL = event.image_url;
        var url = event.event_site_url;
        var address = event.location.address1 + ", " + event.location.city;

        var card = new builder.HeroCard(session)
            .title(name)
            .text(address)
            .images([
                builder.CardImage.create(session, imageURL)])
            .buttons([
                builder.CardAction.openUrl(session, url, 'More Information')
            ]);
        attachment.push(card);
    }

    //Displays event hero card carousel in chat box 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}