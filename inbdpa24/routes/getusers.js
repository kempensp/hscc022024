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
}); // close router.get route

module.exports=router;
    





