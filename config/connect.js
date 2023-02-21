const mongoclient = require('mongodb').MongoClient

const state = {
    db: null
}

module.exports.connect = () => {
    const url = 'mongodb://127.0.0.1:27017'
    const dbname = 'badge'
    var client = new mongoclient(url)
    client.connect().then(res => {
        state.db = res.db(dbname)
        console.log("Connected");
        
    }).catch(error => {
        console.log(error.message);
    })

}


module.exports.get = () => {
    return state.db
}