var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){
    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/e74be4bb-afa8-4001-bdee-5d52773f0b8e/url?iterationId=95fa5780-3da5-4449-b81d-fb38fd1e6794',
        json: true,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Prediction-Key': '57195f3d47824d6399651bf9501df27d'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}