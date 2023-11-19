const Customer = require('../../models/customer/customer.repo');
const Item = require('../../models/item/item.repo');
const Brand = require('../../models/brand/brand.repo');
const Collection = require('../../models/collection/collection.repo');



const getCustomer = async (req, res) => {
    const { email } = req?.user || req?.body;
    let data = await Customer.isExist({ email: email }, [], "-password");
    res.status(data.status).json(data);
}


const updateCustomer = async (req, res) => {
    const id = req.params.id;
    const customerData = req.body;
    let data = await Customer.update({ _id: id }, customerData);
    res.status(data.status).json(data);
}


const updateProfileCustomer = async (req, res) => {
    const id = req?.user?.id || req.query.id;
    const customerData = req.body;
    let data = await Customer.update({ _id: id }, customerData);
    res.status(data.status).json(data);
}


const addToWishList = async (req, res) => {
    const id = req.params.id;
    const { email } = req?.user || req.body;
    let dataCustomer = await Customer.isExist({ email: email });
    if (dataCustomer.status != 200) {
        res.status(dataCustomer.status).json(dataCustomer);
    } else if (dataCustomer.Data.wishList.includes(id) == true) {
        res.status(400).json({
            success: false,
            message: "this item already in wishList",
        });
    } else {
        const data = await Customer.update({ _id: dataCustomer.Data._id }, { $push: { wishList: id } })
        if (data.status == 200) {
            data.message = "this item is added to wishList";
        }
        res.status(data.status).json(data);
    }
}

const deleteFromWishList = async (req, res) => {
    const id = req.params.id;
    const { email } = req?.user || req.body;
    let dataCustomer = await Customer.isExist({ email: email });
    const data = await Customer.update({ _id: dataCustomer.Data._id }, { $pull: { wishList: id } })
    data.message = "this item is deleted from wishList";
    res.status(data.status).json(data);
}

const getWishList = async (req, res) => {
    const { email } = req?.user || req.body;
    let populationQuery = {
        path: 'wishList',
        populate: { path: 'brandId', select: 'name' }
    }
    let data = await Customer.isExist({ email: email }, populationQuery);
    if (data.success == true) {
        res.status(data.status).json({
            wishList: data.Data.wishList,
        });
    } else {
        res.status(data.status).json(data);
    }
}


const likeItem = async (req, res) => {
    const id = req.params.id;
    const { email } = req?.user || req.body;
    let dataCustomer = await Customer.isExist({ email: email });
    if (dataCustomer.success == true) {
        if (dataCustomer.Data.likedItems.includes(id) == true) {
            res.status(400).json({
                success: false,
                message: "this item already in likedItems",
            });
        } else {
            const data = await Customer.update({ _id: dataCustomer.Data._id }, { $push: { likedItems: id } })
            await Item.update({ _id: id }, { $inc: { 'numberOfLikes': 1 } })
            data.message = "this item is liked";
            res.status(data.status).json(data);
        }
    } else {
        res.status(dataCustomer.status).json(dataCustomer);
    }
}

const likeBrand = async (req, res) => {
    const id = req.params.id;
    const { email } = req?.user || req.body;
    let dataCustomer = await Customer.isExist({ email: email });
    if (dataCustomer.success == true) {
        if (dataCustomer.Data.likedBrands.includes(id) == true) {
            res.status(400).json({
                success: false,
                message: "this brand already in likedBrands",
            });
        } else {
            const data = await Customer.update({ _id: dataCustomer.Data._id }, { $push: { likedBrands: id } })
            await Brand.update({ _id: id }, { $inc: { 'numberOfLikes': 1 } })
            data.message = "this brand is liked";
            res.status(data.status).json(data);
        }
    } else {
        res.status(dataCustomer.status).json(dataCustomer);
    }
}


const likeCollection = async (req, res) => {
    const id = req.params.id;
    const { email } = req?.user || req.body;
    let dataCustomer = await Customer.isExist({ email: email });
    if (dataCustomer.success == true) {
        if (dataCustomer.Data.likedCollections.includes(id) == true) {
            res.status(400).json({
                success: false,
                message: "this collection already in likedCollections",
            });
        } else {
            const data = await Customer.update({ _id: dataCustomer.Data._id }, { $push: { likedCollections: id } })
            await Collection.update({ _id: id }, { $inc: { 'numberOfLikes': 1 } })
            data.message = "this collection is liked";
            res.status(data.status).json(data);
        }
    } else {
        res.status(dataCustomer.status).json(dataCustomer);
    }
}


const getLikedItems = async (req, res) => {
    const { email } = req?.user || req.body;
    let populationQuery = {
        path: 'likedItems',
        populate: { path: 'brandId', select: 'name' }
    }
    let data = await Customer.isExist({ email: email }, populationQuery);
    if (data.success == true) {
        res.status(data.status).json({
            likedItems: data.Data.likedItems,
        });
    } else {
        res.status(data.status).json(data);
    }
}


const getLikedBrands = async (req, res) => {
    const { email } = req?.user || req.body;
    let data = await Customer.isExist({ email: email }, ['likedBrands']);
    if (data.success == true) {
        res.status(data.status).json({
            likedBrands: data.Data.likedBrands,
        });
    } else {
        res.status(data.status).json(data);
    }
}


const getlikedCollections = async (req, res) => {
    const { email } = req?.user || req.body;
    let data = await Customer.isExist({ email: email }, ['likedCollections']);
    if (data.success == true) {
        res.status(data.status).json({
            likedCollections: data.Data.likedCollections,
        });
    } else {
        res.status(data.status).json(data);
    }
}


const getCustomerById = async (req, res) => {
    const id = req?.user?.id || req.params.id;
    let data = await Customer.isExist({ _id: id }, { path: "selectedItems", select: "name images price" }, ["selectedItems"]);
    res.status(data.status).json(data);
}


const addItemToSelectedList = async (req, res) => {
    const itemId = req.params.id;
    const customerId = req?.user?.id || req?.query?.customerId
    let dataCustomer = await Customer.isExist({ _id: customerId });
    if (dataCustomer.success == true) {
        if (dataCustomer.Data.selectedItems.includes(itemId) == true) {
            res.status(400).json({
                success: false,
                message: "this item already in Selected Items",
            });
        } else {
            const data = await Customer.update({ _id: dataCustomer.Data._id }, { $push: { selectedItems: itemId } })
            data.message = "this item is selected successfully";
            res.status(data.status).json(data);
        }
    } else {
        res.status(dataCustomer.status).json(dataCustomer);
    }
}


const removeItemFromSelectedList = async (req, res) => {
    const itemId = req.params.id;
    const customerId = req?.user?.id || req?.query?.customerId
    let dataCustomer = await Customer.isExist({ _id: customerId });
    if (dataCustomer.success == true) {
        if (dataCustomer.Data.selectedItems.includes(itemId) == false) {
            res.status(400).json({
                success: false,
                message: "this item is not in Selected Items",
            });
        } else if (dataCustomer.Data.selectedItems.includes(itemId) == true) {
            const data = await Customer.update({ _id: dataCustomer.Data._id }, { $pull: { selectedItems: itemId } })
            data.message = "this item is  no longer in your selected list";
            res.status(data.status).json(data);
        }
    } else {
        res.status(dataCustomer.status).json(dataCustomer);
    }
}


const getSelectedItems = async (req, res) => {
    const { email } = req.user;
    const requestedSize = req.query?.itemSize; // Get the requested size from the query parameter

    let populationQuery = {
        path: 'selectedItems',
        select: '_id name price images sizes',
    };

    let data = await Customer.isExist({ email: email }, populationQuery);

    if (data.success == true) {
        // Filter the selectedItems based on the requested size
        let filteredItems = data.Data.selectedItems
        if(requestedSize){
            filteredItems = data.Data.selectedItems.filter((item) => {
                if (requestedSize === "L" || requestedSize === "XL") {
                    // Fetch items with size "L" or "XL"
                    return item.sizes.includes("L") || item.sizes.includes("XL");
                } else {
                    // Fetch items with the requested size
                    return item.sizes.includes(requestedSize);
                }
            });
        }
       

        res.status(data.status).json({
            success: data.success,
            status: data.status,
            message: "success",
            Data: filteredItems,
            totalResult: filteredItems.length,
            totalPages: 1,
        });
    } else {
        res.status(data.status).json(data);
    }
};


module.exports = {
    getCustomer,
    updateCustomer,
    addToWishList,
    deleteFromWishList,
    getWishList,
    likeItem,
    likeBrand,
    likeCollection,
    getLikedItems,
    getLikedBrands,
    getlikedCollections,
    updateProfileCustomer,
    getCustomerById,
    addItemToSelectedList,
    removeItemFromSelectedList,
    getSelectedItems,
}