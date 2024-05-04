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

//Post route for edit skills
router.post('/:username/editskills', auth, function(req,res,next){
    if ((res.locals.role) && (res.locals.role != 'guest') && (res.locals.name==req.params.username))
    {
        const url = 'https://inbdpa.api.hscc.bdpa.org/v1/users/'+res.locals.user_id;
        const token = process.env.BEARER_TOKEN;
        //Edit skills section
        var skillsarray=[]; //Start with an empty array of skills

        console.log(req.body.skill);
        if ((req.body.skill)!=null){
            skillsarray=req.body.skill; //Take the input fields corresponding to the existing skills and add those to the skills array
            console.log('Skill array exists');
        }
        // Remove all blank skills from skills input fields
        for (var i=skillsarray.length-1; i>=0 ; i--){
            if (skillsarray[i]==''){
                skillsarray.splice(i,1);
            }
        }
        if (req.body.skillnew != null && req.body.skillnew != ''){
        skillsarray.push(req.body.skillnew) //Add this new skill to the array
        }
        const body = {
            "sections":{"skills": skillsarray}
            };
        //console.log(url); //Debug
        console.log(req.body);
        //console.log(req.body.skillnew);
        console.log(body);
        // Pass url, token, and body into RestAPIPatch and redirect to the user profile
        myPatchRestCall.patchWithBearerToken(url, token, body);
        res.redirect('/getusers/'+req.params.username);
    } // close if the token is not a guest portion
    else {  //If the user is a guest, send them to the login route
        res.redirect('/login');
    }
}); //End post route


//post route to edit education:
router.post('/:username/editeducation', auth, function(req,res,next){
//start authed route
    if ((res.locals.role) && (res.locals.role != 'guest') && (res.locals.name==req.params.username)){
//Identify route url and bearer token info
        const url = 'https://inbdpa.api.hscc.bdpa.org/v1/users/'+res.locals.user_id;
        const token = process.env.BEARER_TOKEN;
//Take previous education objects--THIS IS MISSING FOR NOW!!!

//Get education info from form and place it into an object
        var titlenew=req.body.newtitle;
        var startednew=new Date(req.body.newstart);
        var endednew=new Date(req.body.newend);
        var locationnew=req.body.newlocation;
        var descriptionnew=req.body.newdescription;
        //Converted started and ended dates to milliseconds
        console.log(startednew);
        startednew=startednew.getTime();
        endednew=endednew.getTime();
        const neweducation={
            title:titlenew,
            startedAt:startednew,
            endedAt:endednew,
            location: locationnew,
            description: descriptionnew
        };
//Create array with education info object (and previous objects...)
        const educationarray=[neweducation];
//Complete body with array
        const body = {
            "sections":{"education": educationarray}
        };
//Send patch request
        myPatchRestCall.patchWithBearerToken(url, token, body);

//Redirect to user profile page
        res.redirect('/getusers/'+req.params.username);
    }

    // If the user is not appropriately authed send them back to login
    else{
        res.redirect('/login');
    }
}); //END the Education edit route

module.exports = router;