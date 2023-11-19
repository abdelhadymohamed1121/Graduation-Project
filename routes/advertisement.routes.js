const app = require('express').Router();
const { addAdvertisement, updateAdvertisement, deleteAdvertisement,
     getAdvertisementById,getAllAdvertisement, archiveAdvertisement, disArchiveAdvertisement } = require('../controller/advertisement/advertisement.controller');
const { addAdvertisementValidation, updateAdvertisementValidation } = require('../validation/advertisement.validation');
const validator = require('../helper/validator/common.validate');
const isAuthorized = require("../helper/isAuthorized/isAuthorized");
const {
    ADD_ADVERTISMENT,
    GET_ADVERTISMENTS_BY_ID,
    UPDATE_ADVERTISMENT,
    DELETE_ADVERTISMENT,
    GET_ALL_ADVERTISMENT,
    ARCHIVE_ADVERTISMENT,
    DISARCHIVE_ADVERTISMENT,} = require('../endPoints/endPoints');


app.post('/addAdvertisement',[isAuthorized(ADD_ADVERTISMENT),validator(addAdvertisementValidation)], addAdvertisement);
app.get('/getAdvertisementById/:id',[isAuthorized(GET_ADVERTISMENTS_BY_ID)], getAdvertisementById);
app.put('/updateAdvertisement/:id',[isAuthorized(UPDATE_ADVERTISMENT),validator(updateAdvertisementValidation)], updateAdvertisement);
app.delete('/deleteAdvertisement/:id',[isAuthorized(DELETE_ADVERTISMENT)], deleteAdvertisement);
app.get('/getAllAdvertisement',[isAuthorized(GET_ALL_ADVERTISMENT)], getAllAdvertisement);
app.put('/archiveAdvertisement/:id',[isAuthorized(ARCHIVE_ADVERTISMENT)], archiveAdvertisement);
app.put('/disArchiveAdvertisement/:id',[isAuthorized(DISARCHIVE_ADVERTISMENT)], disArchiveAdvertisement);

module.exports = app;