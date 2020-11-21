
const mongoose = require('mongoose');
const env = require('./environment');

function connect() {
    console.log('starting mongo db connection');
    mongoose.connect(`mongodb://${env.COSMOSDB_HOST}:${env.COSMOSDB_PORT}/${env.COSMOSDB_DBNAME}?ssl=true&replicaSet=globaldb`, {
    auth: {
        user: env.COSMOSDB_USER,
        password:env.COSMOSDB_PASSWORD
    },
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
    })
    .then(() => console.log('Connection to CosmosDB successful'))
    .catch((err) => console.error(err));
}

module.exports = {
    connect
}