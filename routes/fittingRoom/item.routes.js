const app = require('express').Router();
const { getItemById, getAllItems, getAllItemsByBrand, getAllItemsByCategory,
    getAllItemsByCollection, getAllItemsWithFilter, itemSearch, getAllOffer, getMostLikedItems,
    getAllBrandItems } = require('../../controller/fittingRoomItem/item.controller');

const isAuthorized = require("../../helper/isAuthorized/isAuthorized.fitting");

app.get('/fitting/getItemById/:id', isAuthorized, getItemById);
app.get('/fitting/getAllItems', getAllItems);
app.get('/fitting/getAllItemsByBrand/:id', isAuthorized, getAllItemsByBrand);
app.get('/fitting/getAllItemsByCategory/:id', isAuthorized, getAllItemsByCategory);
app.get('/fitting/getAllItemsByCollection/:id', isAuthorized, getAllItemsByCollection);
app.get('/fitting/getAllItemsWithFilter', isAuthorized, getAllItemsWithFilter);
app.get("/fitting/itemSearch", isAuthorized, itemSearch);
app.get('/fitting/getAllOffer', isAuthorized, getAllOffer);
app.get('/fitting/getMostLikedItems', isAuthorized, getMostLikedItems);
app.get('/fitting/getAllBrandItems', isAuthorized, getAllBrandItems);

module.exports = app;