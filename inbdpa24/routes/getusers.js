//MODIFY RENDER STATEMENTS TO INCORPORATE AUTH TOKEN INFO!! 4/6/24



var express = require('express');
var router = express.Router();
// Normal include statements

const myGetRestCall=require("../middleware/RestAPIGet");
const myIncrementRestCall = require("../middleware/RestAPIIncrement");
const auth = require("../middleware/verifyToken");
//including middleware

router.get('/', auth, function(req,res,next) {
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
            var lastuserid=userlist[userlist.length-1].user_id;
            res.render('getusers', { 
                title: 'inBDPA Stats' , 
                users: userlist,
                lastuser: lastuserid,
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
            name: res.locals.name
        });
        }
    }) // data then component
    .catch(error => console.error(error));
}); // close router.get general route

router.get('/page/:pagenum', auth, function(req,res,next) {
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
            var lastuserid=userlist[userlist.length-1].user_id;
            res.render('getusers', { 
                title: 'inBDPA Stats' , 
                users: userlist,
                lastuser: lastuserid,
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
            name: res.locals.name
        });
        }
    }) // data then component
    .catch(error => console.error(error));
}); // close router.get general route

// GET route for a specific user (based on username)
router.get('/:username', auth, function(req,res,next) {
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
            var aboutsection=data.user.sections.about;
            var educationsection=data.user.sections.education;
            var experiencesection=data.user.sections.experience;
            var skillssection=data.user.sections.skills;
            var volunteeringsection=data.user.sections.volunteering;
            var userid=data.user.user_id;

            const idurl='https://inbdpa.api.hscc.bdpa.org/v1/users/' + userid;

            console.log(idurl);

            myIncrementRestCall.incrementWithBearerToken(idurl, token);
            res.render('userprofile', 
            {title: 'User profile', 
            username: username,
            type: usertype,
            views: views+1,
            about: aboutsection,
            education: educationsection,
            experience: experiencesection,
            skills: skillssection,
            volunteering: volunteeringsection,
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name
            }); //closes res.render statement



        } // closes if statement
        else{
            res.render('error', {title: 'User call failed',
            message: data.error,
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name
        });
        }


    }) // data then component
    .catch(error => console.error(error));

    // res.render('index', {title: 'debugging user profile page',
    // id: res.locals.user_id,
    // role: res.locals.role,
    // name: res.locals.name});


}); // close router.get username route





module.exports=router;
    





