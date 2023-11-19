const app = require('express').Router();
const {getRecommendation} = require("../controller/recommendation/recommendation.controller");
const isAuthorized = require("../helper/isAuthorized/isAuthorized");
const {GET_ALL_PRODUCT} = require('../endPoints/endPoints');

app.get('/getRecommendation',[isAuthorized(GET_ALL_PRODUCT)], getRecommendation);

module.exports = app;