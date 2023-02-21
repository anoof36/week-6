var express = require('express');
const nocache = require('nocache');
const { response } = require('../app');
var router = express.Router();
const userHelper = require('../Helpers/user-Helper')


/* GET users listing. */
router.get('/', function (req, res) {

  req.session.loggedIn

  if (req.session.loggedIn) {
    res.redirect('/user')
  } else {
    errM = req.session.errM
    req.session.errM = ""
    res.render('signup', { noHeader: true, errM })
  }

});

router.post('/signup', (req, res) => {

  userHelper.signupCheck(req.body)
    .then((access) => {
      userHelper.signUpInsert(req.body).then((response) => {
        req.session.loggedIn = true
        req.session.response
        res.redirect('/user')
      })
    })
    .catch((errM) => {
      console.log(errM)
      req.session.errM = errM
      res.redirect('/signup')

    })




})


module.exports = router;
