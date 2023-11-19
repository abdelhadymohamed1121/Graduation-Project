const { MongoClient } = require('mongodb');

const recommendationDBClient = new MongoClient(process.env.RECOMMENDATION_CONNECTION_STRING_DEPLOY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = recommendationDBClient;