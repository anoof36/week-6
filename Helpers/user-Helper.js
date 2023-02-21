const db = require('../config/connect')
const collection = require('../config/collection')
const bycrpt = require('bcrypt')
const Promise = require('promise')
const { resolve, reject } = require('promise')
const { response } = require('../app')
const { ObjectId } = require('mongodb')

module.exports = {
    signUpInsert: (userData) => {

        return new Promise(async (resolve, reject) => {
            userData.password = await bycrpt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData)
                .then((data) => {
                    return db.get().collection(collection.USER_COLLECTION).findOne({ _id: data.insertedId })
                })
                .then((insertedData) => {
                    resolve(insertedData)
                })
                .catch((error) => {
                    reject(error)
                })



        })

    },

    //checking signup data is already there or not 
    // if there returning ture or else false
    signupCheck: (userData) => {
        return new Promise(async (resolve, reject) => {
            if (userData.password === "" || userData.name === "" || userData.email === "") {
                reject("boxs are empty")
            } else {
                let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
                if (user) {
                    reject("email already exist")
                } else {
                    resolve(true)
                }
            }

        })

    },
    loginCheck: (userData) => {
        return new Promise(async (resolve, reject) => {
            let respond={}
            if (userData.password === "" || userData.name === "" || userData.email === "") {
                reject("boxs are empty")
            } else {

                let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
                if (user) {
                    
                    bycrpt.compare(userData.password, user.password).then((status) => {
                        if (status) {
                            console.log("login success")
                            respond.user=user
                            resolve(status)
                        } else {
                            reject("wrong password")
                            
                        }
                    })
                } else {
                    reject("email is not existing you have to login first")
                }

            }

        })

    },
    updateUser:(userId, userData)=>{
        console.log(userData)
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:new ObjectId(userId)},{
                $set:{
                    name:userData.name,
                    email:userData.email
                }
            }).then((status)=>{
                resolve(status)
            }).catch((err)=>{
                reject("user DAta update faild "+err)
            })
        })
    }

}