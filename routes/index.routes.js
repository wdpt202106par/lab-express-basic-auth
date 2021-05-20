const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index',{isLog:!!req.session.currentUser}));
router.post('/',(req, res, next) => res.render('index',{isLog:!!req.session.currentUser}))
module.exports = router;
