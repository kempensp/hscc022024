//MODIFY RENDER STATEMENTS TO INCORPORATE AUTH TOKEN INFO!! 4/6/24


var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const auth = require("../middleware/verifyToken");
//including middleware

router.get('/', auth, function(req,res,next) {
    const url = 'https://inbdpa.api.hscc.bdpa.org/v1/info';
    const token = process.env.BEARER_TOKEN;
    //console.log(url); //Debug

    // Pass url and token into RestAPIGet and pull information from response
    myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        console.log("REST CALL ", data);
        if (data.success){
            var opportunities=data.info.opportunities;
            var sessions=data.info.sessions;
            var users=data.info.users;
            var views=data.info.views;
            res.render('stats', { 
                title: 'inBDPA Stats' , 
                opportunities: opportunities,
                sessions:sessions,
                users:users,
                views:views
            });
        } // closes if statement
        else{
            res.render('error', {title: 'Stats call failed', message: data.error});
        }
    }) // data then component
    .catch(error => console.error(error));
}); // close router.get route

module.exports=router;
    





