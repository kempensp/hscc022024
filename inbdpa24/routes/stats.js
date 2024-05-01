//MODIFY Get route to require authing to access page (if the user is a guest, redirect to login)


var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const auth = require("../middleware/verifyToken");
//including middleware
var store = require('store');

router.get('/', auth, function(req,res,next) {
    //If the user is authed (to at least inner or higher??), then we pull the info endpoint
    if ((res.locals.role) && (res.locals.role != 'guest'))
    {
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

            store.set("users", {count:users});
            store.set("opportunities", {count:opportunities});

            res.render('stats', { 
                title: 'inBDPA Stats' , 
                opportunities: opportunities,
                sessions:sessions,
                users:users,
                views:views,
                id: res.locals.user_id,
                role: res.locals.role,
                name: res.locals.name
            });
        } // closes if statement
        else{
            res.render('error', {title: 'Stats call failed',
            message: data.error,
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name});
        }
    }) // data then component
    .catch(error => console.error(error));
} // close if the token is not a guest portion
else {  //If the user is a guest, send them to the login route
    res.redirect('/login');
}
}); // close router.get route

module.exports=router;
    





