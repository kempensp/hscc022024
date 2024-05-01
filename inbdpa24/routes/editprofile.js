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
        var skillsarray=[];
        console.log(req.body.skill);
        if ((req.body.skill)!=null){
            skillsarray=req.body.skill;
            console.log('Skill arrary exists');
        }
        // Remove all blanks
        for (var i=0;i<skillsarray.length;i++){
            if (skillsarray[i]==''){
                skillsarray.splice(i,1);
            }
        }
        if (req.body.skillnew != null && req.body.skillnew != ''){
        skillsarray.push(req.body.skillnew)
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

module.exports = router;