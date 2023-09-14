const mongoose = require('mongoose')

async function connectMongoDB(url) {
    return mongoose.connect(url)
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log("Mongo Error", err))
}

module.exports = {connectMongoDB};