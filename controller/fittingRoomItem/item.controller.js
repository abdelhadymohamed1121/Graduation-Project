const Item = require('../../models/item/item.fitting.repo');
const ItemModel = require('../../models/item/item.model');
const idsToUpdate = [
    '648eb16d4aaa3512f80e63ee',
    '648eb16d4aaa3512f80e647c',
    '648eb16d4aaa3512f80e6723',
    '648eb16d4aaa3512f80e58b9',
    '648eb16d4aaa3512f80e58ba',
    '648eb16d4aaa3512f80e3822',
    '648eb16d4aaa3512f80e43cf',
    '648eb16d4aaa3512f80e4cc8',
    '648eb16d4aaa3512f80e4eef',
    '648eb16d4aaa3512f80e37b4',
    '648eb16d4aaa3512f80e4cc8',
    '648eb16d4aaa3512f80e4eef',
    '648eb16d4aaa3512f80e37b4',
    '648eb16d4aaa3512f80e3b21',
    '648eb16d4aaa3512f80e58b8',
    '648eb16d4aaa3512f80e4215',
    '648eb16d4aaa3512f80e5039',
    '648eb16d4aaa3512f80e43cf',
    '648eb16d4aaa3512f80e4eec',
    '648eb16d4aaa3512f80e4f89',
    '648eb16d4aaa3512f80e469f',
    '648eb16d4aaa3512f80e503a',
    '648eb16d4aaa3512f80e3a9e',
    '648eb16d4aaa3512f80e4cc8',
    '648eb16d4aaa3512f80e4eef',
    '648eb16d4aaa3512f80e5db6',
    '648eb16d4aaa3512f80e37b4',
    '648eb16d4aaa3512f80e42ad',
    '648eb16d4aaa3512f80e367a',
    '648eb16d4aaa3512f80e411b',
    '648eb16d4aaa3512f80e4042',
    '648eb16d4aaa3512f80e4047',
    '648eb16d4aaa3512f80e43cf',
]

async function updateDocuments() {
    try {
        for (const id of idsToUpdate) {
            let index = 1
            const updatedObject = await ItemModel.findByIdAndUpdate(
                { _id: id },
                { hasModel: true }
            );

            if (!updatedObject) {
                console.log(`${index}- Object with ID ${id} not found`);
            } else {
                console.log(`${index}- Object with ID ${id} updated successfully:`, updatedObject);
            }
        }
    } catch (error) {
        console.error('Error updating documents:', error);
    }
}


const getItemById = async (req, res) => {
    const id = req.params.id;
    let data = await Item.isExist({ _id: id }, ['categoryList', { path: 'brandId', select: 'name' }]);
    res.status(data.status).json(data);
}


const updateItem = async (req, res) => {
    const id = req.params.id;
    const itemData = req.body;
    let data = await Item.update({ _id: id }, itemData);
    res.status(data.status).json(data);
}


const getAllItems = async (req, res) => {
    let { page, size } = req.query;
    let query = { isArchived: false, hasModel: true }
    const requestedSize = req.query?.itemSize;
    data = await Item.list(query, page, size, { path: 'brandId', select: 'name' });
    if (data.success == true) {
        // Filter the selectedItems based on the requested size
        let filteredItems = data.Data
        if (requestedSize) {
            filteredItems = data.Data.filter((item) => {
                if (requestedSize === "L" || requestedSize === "XL") {
                    // Fetch items with size "L" or "XL"
                    return item.sizes.includes("L") || item.sizes.includes("XL");
                } else {
                    // Fetch items with the requested size
                    return item.sizes.includes(requestedSize);
                }
            });
        }


        return res.status(data.status).json({
            success: data.success,
            status: data.status,
            message: "success",
            Data: filteredItems,
            totalResult: filteredItems.length,
            totalPages: 1,
        });
    } else return res.status(data.status).json(data);

}

const getAllItemsByBrand = async (req, res) => {
    const id = req.params.id;
    let { page, size } = req.query;
    let data = await Item.list({ brandId: id }, page, size);
    res.status(data.status).json(data);
}


const getAllBrandItems = async (req, res) => {
    const id = req.query.id;
    let { page, size } = req.query;
    let data = await Item.list({ brandId: id }, page, size);
    res.status(data.status).json(data);
}


const getAllItemsByCategory = async (req, res) => {
    const id = req.params.id;
    let { page, size } = req.query;
    let data = await Item.list({ categoryList: id }, page, size);
    res.status(data.status).json(data);
}


const getAllItemsByCollection = async (req, res) => {
    const id = req.params.id;
    let { page, size } = req.query;
    let data = await Item.list({ collectionId: id }, page, size);
    res.status(data.status).json(data);
}


const getAllItemsWithFilter = async (req, res) => {
    let { brandId, categoryList, isArchived, priceMin, priceMax, page, size } = req.query;
    let query = {};
    if (brandId) {
        query.brandId = brandId;
    }
    if (categoryList) {
        query.categoryList = categoryList;
    }
    if (!isArchived) {
        isArchived = false;
    }
    query.price = { $lte: priceMax || 1000000000, $gte: priceMin || 0 };

    query.isArchived = false;

    let data = await Item.list(query, page, size, { path: 'brandId', select: 'name' });
    res.status(data.status).json(data);
}


const itemSearch = async (req, res) => {
    let { search, page, size } = req.query;
    let data = await Item.list({ name: { $regex: search, $options: 'i' } }, page, size)
    res.status(data.status).json(data);
}


const getAllOffer = async (req, res) => {
    let { brandId, discountMin, page, size } = req.query;
    let query = {};
    if (brandId) {
        query.brandId = brandId;
    }
    query.discountRate = { $gte: discountMin || 1 };
    let data = await Item.list(query, page, size);
    res.status(data.status).json(data);
}


const getMostLikedItems = async (req, res) => {
    let page = 1;
    let size = 20;
    let data;
    data = await Item.list({ isArchived: false }, page, size, { path: 'brandId', select: 'name' }, { numberOfLikes: -1 });
    res.status(data.status).json(data);
}



module.exports = {
    getItemById,
    updateItem,
    getAllItems,
    getAllItemsByBrand,
    getAllItemsByCategory,
    getAllItemsByCollection,
    getAllItemsWithFilter,
    itemSearch,
    getAllOffer,
    getMostLikedItems,
    getAllBrandItems,
}
