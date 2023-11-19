const Sale = require('../../models/sale/sale.repo');
const Item = require('../../models/item/item.repo');
const Notification = require('../../models/notification/notification.repo');
const logger = require('../../helper/logger/logger');
const io = require('../../helper/socket/socket');

const addSale = async(req,res)=>{
    const {name} = req.body;
    const saleData = req.body;
    let saleisExist = await Sale.isExist({name:name});
    if(saleisExist.success == true){
        res.status(400).json({ 
            success: false,
            message: "this Sale is already in database",
        });
    }else{
        let data = await Sale.create(saleData);
        if(data.status == 200){
            let notificationData =  {
                type: 'sale',
                elementId : data.Data._id,
                name : data.Data.name,
            }
            io.getIO().emit('Notification', notificationData);
            await Notification.create(notificationData);
        }
        res.status(data.status).json(data);
    }
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'addSale',});
}

const getSaleById = async(req,res)=>{
    const id = req.params.id;
    let data = await Sale.isExist({_id : id}, ['itemsList', 'brandId', 'categoryList']);
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getSaleById',});
}

const updateSale = async(req,res)=>{
    const id = req.params.id;
    const {name} = req.body;
    const saleData = req.body;
    let saleisExist = await Sale.isExist({name:name});
    if(saleisExist.success == true){
        res.status(400).json({ 
            success: false,
            message: "this Sale is already in database",
        });
    }else{
        let data = await Sale.update({_id : id}, saleData);
        res.status(data.status).json(data);
    }
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'updateSale',});
}


const deleteSale = async(req,res)=>{
    const id = req.params.id;
    let {deleteItems, archiveItems} = req.query;
    let data = await Sale.delete({_id : id});
    let SaleData = await Sale.isExist({_id : id});
    let list = [];
    if(SaleData.success == true){
        list = SaleData.Data.itemsList;
    }
    if(deleteItems){
        for(let i =0; i < list.length; i++){
            await Item.delete({_id : list[i]});
        }
    }else if(archiveItems){
        for(let i =0; i < list.length; i++){
            await Item.update({_id : list[i]}, {isArchived : true});
        }
    }
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'deleteSale',});
}

const getAllSales = async(req,res)=>{
    let {brandId, categoryList, page, size } = req.query;
    let query= {};
    if(brandId){
        query.brandId = brandId;
    }
    if(categoryList){
        query.categoryList = categoryList;
    }
    let data = await Sale.list(query,page,size);
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getAllSales',});
}

const SaleSearch = async (req, res) => {
    let { search, page, size} = req.query;
    let data;
    if(req.user.role == "vendor"){
        data = await Sale.list({ name: { $regex: search, $options: 'i' }, brandId : req.user.id },page,size);
    }else{
        data = await Sale.list({ name: { $regex: search, $options: 'i' } },page,size);
    }
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'SaleSearch',});
}


const getMostLikedSales = async(req,res)=>{
    let page = 1;
    let size = 20;
    let data = await Sale.list({},page,size, { numberOfLikes : -1});
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getMostLikedSales',});
}

const archiveSale = async(req,res)=>{
    const id = req.params.id;
    let list = [];
    const {archiveItemList} = req.body;
    if(archiveItemList){
        list = archiveItemList;
    }else{
        let saleData = await Sale.isExist({_id : id});
        if(saleData.success == true){
            list = saleData.Data.itemsList;
        }
    }
    const saleData = {
        isArchived : true,
    };
    let data = await Sale.update({_id : id}, saleData);
    for(let i =0; i < list.length; i++){
        await Item.update({_id : list[i]}, saleData);
    }
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'archiveSale',});
}

const disArchiveSale = async(req,res)=>{
    const id = req.params.id;
    let list = [];
    let Data = await Sale.isExist({_id : id});
    if(Data.success == true){
        list = Data.Data.itemsList;
        const saleData = {
            isArchived : false,
        };
        let data = await Sale.update({_id : id}, saleData);
        for(let i =0; i < list.length; i++){
            await Item.update({_id : list[i]}, saleData);
        }
        res.status(data.status).json(data);
    }else{
        Data.message = "please send correct id";
        res.status(Data.status).json(Data);
    }
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'disArchiveSale',});
}


const getAllBrandSales = async(req,res)=>{
    const id = req.user.id;
    let { page, size } = req.query;
    let data = await Sale.list({brandId : id},page,size);
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getAllBrandSales',});
}

module.exports = {
    addSale,
    getSaleById,
    updateSale,
    deleteSale,
    getAllSales,
    SaleSearch,
    getMostLikedSales,
    archiveSale,
    disArchiveSale,
    getAllBrandSales,
}