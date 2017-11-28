var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getYelpData' in RestClient.js with 'displayEventCards' as callback to get list of events information
exports.displayEventCards = function getEventData(location, session){
    var url ='https://api.yelp.com/v3/events?location='+location;
    var auth ='cO92idzWqWjpOsV8RdAoB2DZl2GW8OE8pvoTlOjNNI0gbA2J7xXuiAPtLAYCkPCKR-dIXG3ePsSI4ngt8WRNQ4q4RlKMdXyvJr6r4_L3kndI5wpznLN6WUrPmgDYWXYx';
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
        var url = event.url;
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