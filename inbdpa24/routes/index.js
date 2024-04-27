var express = require('express');
var router = express.Router();
const auth = require("../middleware/verifyToken");
const myGetRestCall=require("../middleware/RestAPIGet");
var store = require('store');


/* GET home page. */
router.get('/', auth, function(req, res, next) {
  //Call the stats API endpoint to get user and opportunity count and store it locally
  const url = 'https://inbdpa.api.hscc.bdpa.org/v1/info';
  const token = process.env.BEARER_TOKEN;
  myGetRestCall.getWithBearerToken(url, token)
    .then(data => {
        //console.log("REST CALL ", data);
        if (data.success){
            var opportunities=data.info.opportunities;
            var users=data.info.users;

            //Use store.set to store the number of users and the number of opportunities
            store.set("users", {count:users});
            store.set("opportunities", {count:opportunities});
 
        } // closes if statement
        else{

        }
    }) // data then component
    .catch(error => console.error(error));



  res.render('index', { 
    title: 'BDPA Milwaukee',
    id: res.locals.user_id,
    role: res.locals.role,
    name: res.locals.name
  });
});

module.exports = router;

// UPDATED WITH RENDERING TOKEN INFO 4/6/24
