const Notification = require('./notification.model');

exports.create = async (Data) => {
    //try {
        let new_Notification = new Notification(Data);
        let result = await new_Notification.save();
        if (result) {
            return {
                success: true,
                status: 201,
                message: "NotificationAdded",
            }
        }
        else {
            return {
                success: false,
                status: 400,
                message: "NotificationNotAdded"
            }
        }
    //} catch {
        return {
            success: false,
            status: 500,
            message: "some thing wrong"
        }
    //}
}

exports.isExist = async (filter, select) => {
    try {
        let result = await Notification.findOne(filter).select(select);
        if (result) {
            return {
                success: true,
                status: 200,
                message: "Notification is Exist",
                Data: result
            }
        }
        else {
            return {
                success: false,
                status: 400,
                message: "Notification is Not Exist"
            }
        }
    } catch {
        return {
            success: false,
            status: 500,
            message: "some thing wrong"
        }
    }
}



exports.list = async (filter, page, size, select) => {
    try {
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        const skip = (page - 1) * limit;
        let result = await Notification.find(filter).limit(limit).skip(skip).select(select);
        const totalResult = await Notification.count(filter);
        const totalPages = Math.ceil(totalResult / limit);
        if (result) {
            return {
                success: true,
                status: 200,
                message: "Notification is Exist",
                Data: result,
                totalResult,
                totalPages,
            }
        }
        else {
            return {
                success: false,
                status: 400,
                message: "Notification is Not Exist"
            }
        }
    } 
    catch {
        return {
            success: false,
            status: 500,
            message: "some thing wrong"
        }
   }
}



exports.update = async (filter, query) => {
    try {
        let result = await Notification.findOneAndUpdate(filter, query,{new:true});
        if (result) {
            return {
                success: true,
                status: 200,
                message: "NotificationUpdated",
            }
        }
        else {
            return {
                success: false,
                status: 400,
                message: "NotificationNotUpdated"
            }
        }
    } catch {
        return {
            success: false,
            status: 500,
            message: "some thing wrong"
        }
    }
}


exports.delete = async (filter) => {
    try {
        let result = await Notification.findOneAndDelete(filter);
        if (result) {
            return {
                success: true,
                status: 200,
                message: "NotificationDeleted",
            }
        }
        else {
            return {
                success: false,
                status: 400,
                message: "NotificationNotDeleted"
            }
        }
    } catch {
        return {
            success: false,
            status: 500,
            message: "some thing wrong"
        }
    }
}