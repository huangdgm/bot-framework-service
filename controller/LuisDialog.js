var builder = require('botbuilder');
var food = require("./FavouriteFoods");
var restaurant = require('./RestaurantCard');
var event = require('./EventCard');
var currency = require('./CurrencyCard');
var nutrition = require('./NutritionCard');
var customVision = require('./CustomVision')

// Some sections have been omitted
//var isAttachment = false;


exports.startDialog = function (bot) {
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/60550629-34a1-45ea-8e44-e5baa4bd4d0e?subscription-key=581def6fd85842c28c2e25762b3ac2c8&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);

    bot.dialog('GetCalories', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Calculating calories in %s...', foodEntity.entity);
                nutrition.displayNutritionCards(foodEntity.entity, session);
            } else {
                session.send("No food identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'GetCalories'
    });

    bot.dialog('GetFavouriteFood', [
        function (session, args, next) {
			if(!isAttachment(session)){
				session.dialogData.args = args || {};        
				if (!session.conversationData["username"]) {
					builder.Prompts.text(session, "Enter a username to setup your account.");
					// next();	// Dong: After the user enter the username, directly display the favourite food
				} else {
					next(); // Skip if we already have this info.
				}
			}
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your favourite foods");
                food.displayFavouriteFood(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            }
        }
    ]).triggerAction({
        matches: 'GetFavouriteFood'
    });

	bot.dialog('DeleteFavourite', [
        function (session, args, next) {
			if(!isAttachment(session)){
				session.dialogData.args = args || {};
				if (!session.conversationData["username"]) {
					builder.Prompts.text(session, "Enter a username to setup your account.");
				} else {
					next(); // Skip if we already have this info.
				}
			}
        },
        function (session, results,next) {
        if(!isAttachment(session)){
            //Add this code in otherwise your username will not work.
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("You want to delete one of your favourite foods.");
        
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Deleting \'%s\'...', foodEntity.entity);
                food.deleteFavouriteFood(session,session.conversationData['username'],foodEntity.entity); //<--- CALLL WE WANT
            } else {
                session.send("No food identified! Please try again");
            }
        
        }
    }]).triggerAction({
        matches: 'DeleteFavourite'
    });

    bot.dialog('WantFood', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');
        
            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                restaurant.displayRestaurantCards(foodEntity.entity, "auckland", session);
            } else {
                session.send("No food identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'WantFood'
    });

	bot.dialog('LookForEvent', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the location entity from the session if it exists
            var locationEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'location');
        
            // Checks if the for entity was found
            if (locationEntity) {
                session.send('Looking for events in %s...', locationEntity.entity);
                event.displayEventCards(locationEntity.entity, session);
            } else {
                session.send("No event identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'LookForEvent'
    });
	
	bot.dialog('GetRates', function (session, args) {
        if (!isAttachment(session)) {
            // Pulls out the currency entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'currency');
        
            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Looking for rates for %s...', currencyEntity.entity);
                currency.displayCurrencyCards(currencyEntity.entity, session);
            } else {
                session.send("No currency identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'GetRates'
    });
	
	bot.dialog('WhoAreYou', function (session, args) {
		if (!isAttachment(session)) {
			//bot.displayBotCard(session);
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
    }).triggerAction({
        matches: 'WhoAreYou'
    });

    bot.dialog('WelcomeIntent', function (session, args) {
		if(!isAttachment(session)){	// Dong
			session.send("hi there");
		}
    }).triggerAction({
        matches: 'WelcomeIntent'
    });

    bot.dialog('LookForFavourite', [
        function (session, args, next) {	// Dong
			if(!isAttachment(session)){
				session.dialogData.args = args || {};        
				if (!session.conversationData["username"]) {
					builder.Prompts.text(session, "Enter a username to setup your account.");                
				} else {
					next(); // Skip if we already have this info.
				}
			}
        },
        function (session, results, next) {
            if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // Pulls out the food entity from the session if it exists
                var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
    
                // Checks if the food entity was found
                if (foodEntity) {
                    session.send('Thanks for telling me that \'%s\' is your favourite food', foodEntity.entity);
                    food.sendFavouriteFood(session, session.conversationData["username"], foodEntity.entity); // <-- LINE WE WANT
                } else {
                    session.send("No food identified!!!");
                    console.log("Look for favourite")
                }
            }
        }
    ]).triggerAction({
        matches: 'LookForFavourite'
    });

    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http") || msg.includes("https")) {
            //call custom vision
            customVision.retreiveMessage(session);
    
            return true;
        }
        else {
            return false;
        }
    }
}