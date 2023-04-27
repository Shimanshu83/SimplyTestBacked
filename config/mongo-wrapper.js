const mongoose = require('mongoose')

class MongoWrapper {

    connect() {
        return new Promise((resolve, reject) => {
            mongoose.set("strictQuery", false);
            mongoose.connect(process.env.DB_URL)
                .then(() => {
                    console.log('Connected to mongodb')
                    resolve()
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}

module.exports = new MongoWrapper()