const express = require('express');

const router = express.Router();

router.get('/', function(req, res, next) {
    res.send({  status:'1111'})
});

module.exports = router;