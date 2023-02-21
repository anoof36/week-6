var express = require('express');
const { Db } = require('mongodb');
var router = express.Router();
const db = require('../config/connect')
const collection = require('../config/collection');
const { USER_COLLECTION } = require('../config/collection');
const userHelper = require('../Helpers/user-Helper');
const nocache = require('nocache');
// var nocache = require('nocache')

/* GET home page. */
router.get('/',(req, res) => {
  
  if(req.session.loggedIn){
    res.redirect('/user')
    console.log("I am user")
  }else{
    try{
      var errM= req.session.errM
    }catch{
      var errM= ""
    }
    
    req.session.errM=""
    res.render('index',{noHeader:true, errM});
    console.log("I am login")
  }
  
});



router.post('/login', (req, res) => {
  userHelper.loginCheck(req.body)
    .then((respond) => {
      if (respond) {
        req.session.loggedIn=true
        req.session.user=respond.user
        res.redirect('/user')
      } 
    }).catch((err)=>{
      console.log(err)
      req.session.errM =err
      res.redirect('/')
    })

})


router.get('/logout',nocache(),(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
