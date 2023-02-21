var express = require('express');
const nocache = require('nocache');
const collection = require('../config/collection');
const productHelper = require('../Helpers/product-Helper');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res) {
  try{
    var user = req.session.user
    var userName = user.name
  }catch{
    var userName = "guest"
  }
  if(req.session.loggedIn){
    productHelper.getAllProducts(collection.PRODUCT_COLLECTOIN).then((products)=>{
      res.render('user/view-products',{products, userName})
    })
  }else{
    res.redirect('/')
  }
  
  

});



module.exports = router;