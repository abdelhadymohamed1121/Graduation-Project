const app = require('express').Router();
const { getCustomer, updateCustomer, addToWishList, deleteFromWishList,
    likeItem, likeBrand, likeCollection, getLikedItems, getLikedBrands,
    getlikedCollections, updateProfileCustomer, getCustomerById,
    getWishList, addItemToSelectedList, removeItemFromSelectedList,getSelectedItems } = require('../../controller/fittingRoomCustomer/customer.controller');

const isAuthorized = require("../../helper/isAuthorized/isAuthorized.fitting");

app.get('/fitting/getCustomer', isAuthorized(), getCustomer);
app.put('/fitting/updateCustomer/:id', isAuthorized(), updateCustomer);
app.post('/fitting/addToWishList/:id', isAuthorized(), addToWishList);
app.delete('/fitting/deleteFromWishList/:id', isAuthorized(), deleteFromWishList);
app.get('/fitting/getWishList', isAuthorized(), getWishList);
app.get('/fitting/likeItem/:id', isAuthorized(), likeItem);
app.get('/fitting/likeBrand/:id', isAuthorized(), likeBrand);
app.get('/fitting/likeCollection/:id', isAuthorized(), likeCollection);
app.get('/fitting/getLikedItems', isAuthorized(), getLikedItems);
app.get('/fitting/getLikedBrands', isAuthorized(), getLikedBrands);
app.get('/fitting/getlikedCollections', isAuthorized(), getlikedCollections);
app.put('/fitting/updateProfileCustomer', isAuthorized(), updateProfileCustomer);
app.get('/fitting/getCustomerById/:id', isAuthorized(), getCustomerById);
app.put('/fitting/selectItem/:id', isAuthorized(), addItemToSelectedList);
app.put('/fitting/removeItem/:id', isAuthorized(), removeItemFromSelectedList);
app.get('/fitting/getSelectedItems', isAuthorized(), getSelectedItems);

module.exports = app;