var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getFixerCurrencyData' in RestClient.js with 'displayCurrencyCards' as callback to get list of currency information
exports.displayCurrencyCards = function getCurrencyData(base, session){
    var url ='https://api.fixer.io/latest?base='+base;
    rest.getFixerCurrencyData(url,session,displayCurrencyCards);
}

function displayCurrencyCards(message, session) {
    var attachment = [];
    var ratesFound = JSON.parse(message);
    
    //For each rate, add herocard with name and rate in attachment
    var base = ratesFound.name;
	var rates = ratesFound.rates;
	var date = ratesFound.date;

    var card = new builder.HeroCard(session)
        .title(base)
        .text(rates)
		.text(date);
    attachment.push(card);

    //Displays rates hero card carousel in chat box 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}