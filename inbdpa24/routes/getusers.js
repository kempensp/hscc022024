var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
//including middleware

router.get('/', function(req,res,next) {
    const url = 'https://inbdpa.api.hscc.bdpa.org/v1/users';
    const token = process.env.BEARER_TOKEN;
    //console.log(url); //Debug

    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        console.log("REST CALL ", data);
        if (data.success){
            // SUBJECT TO CHANGE
            var userlist=data.users;

            res.render('getusers', { 
                title: 'inBDPA Stats' , 
                users: userlist
            });
        } // closes if statement
        else{
            res.render('error', {title: 'Stats call failed', message: data.error});
        }
    }) // data then component
    .catch(error => console.error(error));
}); // close router.get general route

// GET route for a specific user (based on username)
router.get('/:username', function(req,res,next) {
    const url = 'https://inbdpa.api.hscc.bdpa.org/v1/users/' + req.params.username;
    const token = process.env.BEARER_TOKEN;

    //console.log(url); //Debugging code to test url; I'll comment it out once it works

    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        console.log('REST CALL',data);
        if (data.success){
            // SUBJECT TO CHANGE
            var username=data.user.username;
            var usertype=data.user.type;
            var views=data.user.views;

            res.render('userprofile', {title: 'User profile', username:username});
        } // closes if statement
        else{
            res.render('error', {title: 'User call failed', message: data.error});
        }


    }) // data then component
    .catch(error => console.error(error));

    //res.render('index', {title: 'debugging user profile page'});


}); // close router.get username route





module.exports=router;
    





