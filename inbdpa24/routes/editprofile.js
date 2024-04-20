var express = require('express');
var router = express.Router();
const auth = require("../middleware/verifyToken");
const myPatchRestCall=require("../middleware/RestAPIPatch");

router.post('/:username/editabout', auth, function(req,res,next){
    if ((res.locals.role) && (res.locals.role != 'guest') && (res.locals.name==req.params.username))
    {
        const url = 'https://inbdpa.api.hscc.bdpa.org/v1/users/'+res.locals.user_id;
        const token = process.env.BEARER_TOKEN;
        const body = {
            "sections":{"about": req.body.aboutme}
            };
        //console.log(url); //Debug

        // Pass url, token, and body into RestAPIPatch and redirect to the user profile
        myPatchRestCall.patchWithBearerToken(url, token, body)
        res.redirect('/getusers/'+req.params.username);
    } // close if the token is not a guest portion
    else {  //If the user is a guest, send them to the login route
        res.redirect('/login');
    }
}); //End post route

module.exports = router;