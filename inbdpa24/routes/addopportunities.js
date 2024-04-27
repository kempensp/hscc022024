var express = require('express');
var router = express.Router();

const auth = require("../middleware/verifyToken");
var MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
const myPostRestCall=require("../middleware/RestAPIPost");

router.get('/', auth, function(req,res,next) {
    if ((res.locals.role) && (res.locals.role != 'guest')){
        res.render('addopportunities', { 
            title: 'inBDPA Stats' , 
            id: res.locals.user_id,
            role: res.locals.role,
            name: res.locals.name
        });
    }
    else{
        res.redirect('/login');
    }
});

router.post('/', auth, function(req,res,next) {
    if ((res.locals.role) && (res.locals.role != 'guest')){
        //POST INFORMATION
        const url="https://inbdpa.api.hscc.bdpa.org/v1/opportunities";
        const token=process.env.BEARER_TOKEN;
        const body = {
            "title":req.body.title,
            "contents":req.body.contents,
            "creator_id":res.locals.user_id
        };
        //console.log("Body",JSON.stringify(body));
        myPostRestCall.postWithBearerToken(url, token, body);
        res.redirect('getopportunities');
    }
    else{
        res.redirect('/login');
    }
});
module.exports = router;