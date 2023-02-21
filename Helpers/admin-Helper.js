const { resolve, reject } = require("promise")
const collection = require('../config/collection')
const db = require('../config/connect')

module.exports = {
    adminLogin: (adminData) => {
        return new Promise((resolve, reject) => {
            if (adminData.email === "" || adminData.password === "") 
            {
                reject("deatails not found")
            } 
            else 
            {
                db.get().collection(collection.ADMIN_COLLECTION).findOne({email:adminData.email}).then((document)=>{
                    if(document){
                        if(document.email === adminData.email && document.password === adminData.password){
                            resolve(document)
                        }else{
                            reject("wrong password!")
                        }
                    }else{
                        reject("Email incorrect ")
                    }
                })
            }
        })

    }
}