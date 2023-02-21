var express = require('express');
var router = express.Router();
const productHelpers = require('../Helpers/product-Helper')
const adminHelpers = require('../Helpers/admin-Helper');
const collection = require('../config/collection');
const userHelper = require('../Helpers/user-Helper');




/* GET users listing. */
router.get('/', function (req, res) {
    try {
        var user = req.session.admin

        var adminName = user.email
    } catch {
        var adminName = "guest"
    }

    if (req.session.adminLog) {

        productHelpers.getAllProducts(collection.PRODUCT_COLLECTOIN).then((products) => {
            res.render('admin/view-product', { admin: true, products, adminName })
        })
    } else {
        res.redirect('/admin/admin-login')
    }
});

router.get('/admin-login', (req, res) => {
    if (req.session.adminLog) {
        res.redirect('/admin')
    } else {
        var errM = req.session.errM
        req.session.errM = ""
        res.render('admin/admin-login', { noHeader: true, errM })
    }

})
//function for checking session.loggedin or not

var sessionCheck = (req, res, next) => {
    if (req.session.adminLog) {
        next()
    } else {
        res.redirect('/admin')
    }
}



router.post('/admin-login', (req, res) => {
    adminHelpers.adminLogin(req.body).then((document) => {
        req.session.adminLog = true
        req.session.admin = req.body
        res.redirect('/admin')
    })
        .catch((err) => {
            req.session.errM = err
            res.redirect('/admin')
        })

})

router.use(sessionCheck)

router.get('/add-product', (req, res) => {
    res.render('admin/add-product', { admin: true })
})



router.post('/add-product', (req, res) => {
    var collectionName = collection.PRODUCT_COLLECTOIN
    productHelpers.addProduct(req.body, collectionName).then((id => {
        let image = req.files.file
        image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
            if (!err) {
                console.log("upload successfull")
                res.redirect('/admin/add-product')
            } else {
                // res.redirect('/admin/add-product')
                res.send("hello")
                console.log(err)
            }
        })
    }))


})

router.get('/add-userData', (req, res) => {
    res.render('admin/add-user')
})

router.post('/add-user', (req, res) => {
    userHelper.signupCheck(req.body).then((resp) => {
        userHelper.signUpInsert(req.body).then((userData) => {
            console.log("user DAta inserted successfully")
            res.redirect('/admin/allUsers')
        })
            .catch((err) => {
                console.log("Error while data insert")
                res.redirect('/admin/add-userData')
            })
    })
        .catch((err) => {
            console.log(err)
            res.redirect('/admin/add-userData')
        })


})

router.get('/delete-product', (req, res) => {
    let productId = req.query.id
    var collectionName = collection.PRODUCT_COLLECTOIN
    productHelpers.deleteProduct(productId, collectionName)
        .then((status) => {
            if (status) {
                res.redirect('/admin/')
                console.log("Deleted Successfully")
            } else {
                res.redirect('/admin/')
                console.log("Error while deleting")
            }
        }).catch((err) => {
            console.log(err)
        })

})
router.get('/edit-product', async (req, res) => {
    let productId = req.query.id
    var collectionName = collection.PRODUCT_COLLECTOIN
    let productData = await productHelpers.getProduct(productId, collectionName)
    res.render('admin/edit-product', { admin: true, productData })
})

router.post('/edit-product', (req, res) => {
    productHelpers.updateProduct(req.query.id, req.body).then(() => {
        console.log("Data uploaded")
        res.redirect('/admin')
        try {
            if (req.files.file) {
                let image = req.files.file
                image.mv('./public/product-images/' + req.query.id + '.jpg')
            }
        } catch {
            console.log("error find")
        }

    })

})

router.get('/allUsers', (req, res) => {
    try {
        var adminName = req.session.admin.email
    } catch {
        console.log("catch worked line 33 alluser get")
    }

    productHelpers.getAllProducts(collection.USER_COLLECTION).then((users) => {
        res.render('admin/view-users', { users, admin: true, adminName })
    })

})


router.get('/delete-user', (req, res) => {
    userId = req.query.id
    var collectionName = collection.USER_COLLECTION
    productHelpers.deleteProduct(userId, collectionName).then((status) => {
        res.redirect('/admin/allUsers')
    })
        .catch((err) => {
            console.log(err)
        })
})


router.get('/edit-user', async (req, res) => {
    var userId = req.query.id
    var collectionName = collection.USER_COLLECTION
    let userData = await productHelpers.getProduct(userId, collectionName)
    res.render('admin/edit-user', { userData })
})

router.post('/edit-user', (req, res) => {
    var userId = req.query.id
    console.log("i am worked")
    userHelper.updateUser(userId, req.body).then((status) => {
        console.log("updata success")
        res.redirect('/admin/allUsers')
    })
})


router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin')
})


module.exports = router;