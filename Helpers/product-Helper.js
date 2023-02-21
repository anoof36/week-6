
const { ObjectId } = require('mongodb')
const { resolve, reject } = require('promise')
const { response } = require('../app')
const collection = require('../config/collection')
const db = require('../config/connect')


module.exports = {
    addProduct: (product, collectionName) => {
        return new Promise((resoleve, reject) => {
            db.get().collection(collectionName).insertOne(product).then((data) => {
                var id = data.insertedId
                resoleve(id)
            })
        })

    },
    getAllProducts: (collectionName) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collectionName).find().limit(3).toArray()

            resolve(products)
        })
    },
    deleteProduct: (productDeatails, collectionName) => {
        return new Promise(async (resolve, reject) => {

            let status = await db.get().collection(collectionName).deleteOne({ _id: new ObjectId(productDeatails) })
            console.log(status)
            if (status) {
                resolve(status)
            } else {
                reject("error happend")
            }



        })
    },
    getProduct: (productId, collectionName) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collectionName).findOne({ _id: new ObjectId(productId) }).then((document) => {
                resolve(document)
            })
        })
    },
    updateProduct: (productId, newData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTOIN).updateOne({ _id: new ObjectId(productId) }, {
                $set: {
                    Name: newData.Name,
                    Category: newData.Category,
                    Price: newData.Price
                }
            }).then((response) => {
                resolve()
            })
        })
    }
}