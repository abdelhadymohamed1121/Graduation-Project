const Category = require('../../models/category/category.repo');
const Brand = require('../../models/brand/brand.repo');
const Collection = require('../../models/collection/collection.repo');
const Item = require('../../models/item/item.repo');
const logger = require('../../helper/logger/logger');

const addCategory = async(req,res)=>{
    const {name} = req.body;
    const categoryData = req.body;
    let categoryisExist = await Category.isExist({name:name});
    if(categoryisExist.success == true){
        res.status(400).json({ 
            success: false,
            message: "this category is already in database",
        });
    }else{
        let data = await Category.create(categoryData);
        res.status(data.status).json(data);
    }
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'addCategory',});
}

const getCategoryById = async(req,res)=>{
    const id = req.params.id;
    let data = await Category.isExist({_id:id});
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getCategoryById',});
}

const updateCategory = async(req,res)=>{
    const id = req.params.id;
    const {name} = req.body;
    const categoryData = req.body;
    let categoryisExist = await Category.isExist({name:name});
    if(categoryisExist.success == true){
        res.status(400).json({ 
            success: false,
            message: "this category is already in database",
        });
    }else{
        let data = await Category.update({_id:id}, categoryData);
        res.status(data.status).json(data);
    }
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'updateCategory',});
}


const deleteCategory = async(req,res)=>{
    const id = req.params.id;
    let data = await Category.delete({_id:id});
    await Brand.updateList({ categoryList: id }, { '$pull': { categoryList: id }});
    await Item.updateList({ categoryList: id }, { '$pull': { categoryList: id }});
    await Collection.updateList({ categoryList: id }, { '$pull': { categoryList: id }});
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'deleteCategory',});
}

const getAllCategories = async(req,res)=>{
    let { page, size } = req.query;
    let data = await Category.list({},page,size);
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'getAllCategories',});
}

const categorySearch = async (req, res) => {
    let { search, page, size} = req.query;
    let data = await Category.list({ name: { $regex: search, $options: 'i' } },page,size)
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: req.user.role, action : 'categorySearch',});
}


module.exports = {
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllCategories,
    categorySearch,
}