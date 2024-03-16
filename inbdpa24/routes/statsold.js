var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const httpRequest = require('https');

    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + process.env.BEARER_TOKEN,
            'content-type': 'application/json'
        }};
    
    //console.log(options.headers);

    const request = httpRequest.request('https://inbdpa.api.hscc.bdpa.org/v1/info', options, response => {
        console.log('Status', response.statusCode);
        console.log('Headers', response.headers);
    let responseData = '';

    response.on('data', dataChunk => {
        responseData += dataChunk;
    });
    response.on('end', () => {
        console.log('Response: ', responseData)
        // Parse the response data
        let responseParsed=JSON.parse(responseData);
        // and then put subitems into variables
        var opportunities=responseParsed.info.opportunities;
        var sessions=responseParsed.info.sessions;
        var users=responseParsed.info.users;
        var views=responseParsed.info.views;
        // and then render the ejs view page with this information

        //console.log('Opportunities=', opportunities);
        res.render('stats', { 
            title: 'inBDPA Stats' , 
            opportunities: opportunities,
            sessions:sessions,
            users:users,
            views:views
        });
    });
    });

    request.on('error', error => console.log('ERROR', error));

    request.end(); 




});

module.exports = router;