//MODIFY RENDER STATEMENTS TO INCORPORATE AUTH TOKEN INFO!! 4/6/24

var express = require('express');
var router = express.Router();
const auth = require("../middleware/verifyToken");

/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
