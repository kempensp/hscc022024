var express = require('express');
var router = express.Router();
const auth = require("../middleware/verifyToken");

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  res.render('index', { 
    title: 'BDPA Milwaukee',
    id: res.locals.user_id,
    role: res.locals.role,
    name: res.locals.name
  });
});

module.exports = router;

// UPDATED WITH RENDERING TOKEN INFO 4/6/24
