const Recommendation = require('../../models/recommendation/recommendation.repo');
const ObjectId = require("mongodb").ObjectId;
const Item = require("../../models/item/item.model");
const moongose = require("mongoose");

const getRecommendation = async(req,res)=>{
    const id = new ObjectId(req.user.id);
    let data = await Recommendation.isExist({_id : id});
    let list = [];
    for(let i=0; i<data.Data.itemList.length; i++){
        list.push({'_id' : moongose.Types.ObjectId(data.Data.itemList[i])});
    }
    data.Data.itemList = await Item.find({$or: list}); 
    res.status(data.status).json(data);
}

module.exports = {
    getRecommendation
}