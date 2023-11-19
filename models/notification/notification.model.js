const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    elementId: {
        type: String,
        required: true,
    },
})


const notificationModel = mongoose.model('notification', notificationSchema);

module.exports = notificationModel;