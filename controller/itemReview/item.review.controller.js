const ItemReview = require('../../models/itemReview/item.review.repo');
const Item = require('../../models/item/item.repo');
const logger = require('../../helper/logger/logger');
var mongoose = require('mongoose');

const addItemReview = async(req,res)=>{
    const reviewData = req.body;
    reviewData.customerId = req.user.id;
    let itemData = await Item.isExist({_id : reviewData.itemId});
    if(itemData.success == true){
        let data = await ItemReview.create(reviewData);
        let sumOfRate = itemData.Data.averageRate * itemData.Data.numberOfReviews;
        sumOfRate += reviewData.rate;
        let averageRate = sumOfRate / (itemData.Data.numberOfReviews+1);
        await Item.update({_id : reviewData.itemId}, {$inc : {'numberOfReviews' : 1} , averageRate : averageRate})
        res.status(data.status).json(data);
    }else{
        res.status(itemData.status).json(itemData);
    }
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'addItemReview',});
}

const getItemReviewById = async(req,res)=>{
    const id = req.params.id;
    let data = await ItemReview.isExist({_id:id});
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getItemReviewById',});
}

const updateItemReview = async(req,res)=>{
    const id = req.params.id;
    const {rate , comment} = req.body;
    let reviewData = await ItemReview.isExist({_id:id});
    let data = await ItemReview.update({_id:id, customerId : req.user.id}, {rate , comment});
    if(data.success == false){
        data.message = "you can not update this comment";
    }else{
        if(rate){
            let itemData = await Item.isExist({_id : reviewData.Data.itemId})
            let sumOfRate = itemData.Data.averageRate * itemData.Data.numberOfReviews;
            sumOfRate -= reviewData.Data.rate;
            sumOfRate += rate;
            let averageRate = sumOfRate / (itemData.Data.numberOfReviews);
            await Item.update({_id : reviewData.Data.itemId}, {averageRate : averageRate})   
        }
    }
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'updateItemReview',});
}


const deleteItemReview = async(req,res)=>{
    const id = req.params.id;
    let reviewData = await ItemReview.isExist({_id:id});
    let data = await ItemReview.delete({_id:id, customerId : req.user.id});
    if(data.success == false){
        data.message = "you can not delete this comment";
    }else{
        let itemData = await Item.isExist({_id : reviewData.Data.itemId})
        let sumOfRate = itemData.Data.averageRate * itemData.Data.numberOfReviews;
        sumOfRate -= reviewData.Data.rate;
        let averageRate;
        if(itemData.Data.numberOfReviews-1 == 0){
            averageRate = 0;
        }else{
            averageRate = sumOfRate / (itemData.Data.numberOfReviews-1);
        }
        await Item.update({_id : reviewData.Data.itemId}, {$inc : {'numberOfReviews' : -1}, averageRate : averageRate})
    }
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'deleteItemReview',});
}


const getAllItemReviews = async(req,res)=>{
    const id = req.params.id;
    let {page, size } = req.query;
    let data = await ItemReview.list({itemId : id},page,size, { path: 'customerId', select: 'name image' } , "-itemId");
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getAllItemReviews',});
}


const getAllCustomerReviewsForItems = async(req,res)=>{
    const id = req.user.id;
    let {page, size } = req.query;
    let data = await ItemReview.list({customerId : id},page,size, { path: 'itemId', select: 'name cover' });
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getAllCustomerReviewsForItems',});
}

const convertItemIdInItemReviews = async(req,res)=>{
    let page = 1;
    let size = 5000000;
    let data = await ItemReview.list({},page,size);
    data.Data.map(async(item)=>{
        //console.log(item);
        var id = mongoose.Types.ObjectId(item.itemId);
        itemData = {
            itemId : id,
        }
        await ItemReview.update({_id : item._id}, itemData);
    })
    res.status(data.status).json(data);
}

const convertCustomerIdInItemReviews = async(req,res)=>{
    let page = 1;
    let size = 5000000;
    let data = await ItemReview.list({},page,size);
    data.Data.map(async(item)=>{
        //console.log(item);
        var id = mongoose.Types.ObjectId(item.customerId);
        itemData = {
            customerId : id,
        }
        await ItemReview.update({_id : item._id}, itemData);
    })
    res.status(data.status).json(data);
}


module.exports = {
    addItemReview,
    getItemReviewById,
    updateItemReview,
    deleteItemReview,
    getAllItemReviews,
    getAllCustomerReviewsForItems,
    convertItemIdInItemReviews,
    convertCustomerIdInItemReviews,
}