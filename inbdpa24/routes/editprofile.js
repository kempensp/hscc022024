var express = require('express');
var router = express.Router();
const auth = require("../middleware/verifyToken");

router.post('/:username', auth, function(req,res,next){

    //TO START TESTING, CREATE SOME DUMMY CODE AND A REDIRECT
    console.log("Posting to profile:", req.params.username);
    console.log("Profile id:", res.locals.user_id);
//PATCH REQUEST WILL BE MODIFIED TO MIDDLEWARE LATER:
const httpRequest = require('https');

const options = {
  method: 'PATCH',
  headers: {
        'Authorization': 'bearer '+process.env.BEARER_TOKEN,
        'content-type': 'application/json'
    },
    };

    const data = JSON.stringify({
    "sections":{"about": req.body.aboutme}
    })

    const request = httpRequest.request('https://inbdpa.api.hscc.bdpa.org/v1/users/'+res.locals.user_id, options, response => {
    console.log('Status', response.statusCode);
    console.log('Headers', response.headers);
    let responseData = '';

    response.on('data', dataChunk => {
        responseData += dataChunk;
    });
    response.on('end', () => {
        console.log('Response: ', responseData)
    });
    });

    request.on('error', error => console.log('ERROR', error));

    request.write(data);
    request.end();




    res.redirect('/getusers/'+req.params.username);

}); //End post route

module.exports = router;