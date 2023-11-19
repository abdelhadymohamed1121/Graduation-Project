const Admin = require('../../models/admin/admin.repo');
const bcrypt = require('bcrypt');
const saltRounds = 5;
const logger = require("../../helper/logger/logger");
var jwt = require('jsonwebtoken');

const loginAdmin = async(req,res)=>{
    const {email,password} = req.body;
    let admin = await Admin.isExist({email:email});
    if (admin.success == false) {
        res.status(400).json({ message: "Please enter a valid email" })
    } else {
        let match = await bcrypt.compare(password, admin.Data.password);
        if (match) {
            let token = jwt.sign({ id: admin.Data._id, email : admin.Data.email, role: "admin" }, process.env.SECRET_KEY);
            res.status(200).json({ message: "Success", token });
        } else {
            res.status(422).json({ message: "This password is invalid" })
        }
        logger.log({level : 'info',id: admin.Data._id, role: 'admin', action : 'loginAdmin',});
    }
}


const addAdmin = async(req,res)=>{
    const {email} = req.body;
    const adminData = req.body;
    let adminisExist = await Admin.isExist({email:email});
    if(adminisExist.success == true){
        res.status(400).json({ 
            success: false,
            message: "this email is taken",
        });
    }else{
        const hashPassword =  await bcrypt.hash(adminData.password, saltRounds);
        adminData.password = hashPassword;
        adminData.role = "admin";
        let data = await Admin.create(adminData);
        res.status(data.status).json(data);
    }
    logger.log({level : 'info' , id: req.user.id , role: 'admin', action : 'addAdmin',});
}

const getAdmin = async(req,res)=>{
    const {email} = req.user;
    let data = await Admin.isExist({email:email}, "-password");
    res.status(data.status).json(data);
    logger.log({level : 'info',id: req.user.id,role: 'admin',action : 'getAdmin',});
}

const getAdminById = async(req,res)=>{
    const id = req.params.id;
    let data = await Admin.isExist({_id:id}, "-password");
    res.status(data.status).json(data);
    logger.log({level : 'info',id: req.user.id,role: 'admin',action : 'getAdminById',});
}

const updateAdmin = async(req,res)=>{
    const id = req.params.id;
    const adminData = req.body;
    let data = await Admin.update({_id:id}, adminData);
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: 'admin', action : 'updateAdmin',});
}


const deleteAdmin = async(req,res)=>{
    const id = req.params.id;
    let data = await Admin.delete({_id:id});
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: 'admin', action : 'deleteAdmin',});
}

const getAllAdmins = async(req,res)=>{
    let { page, size } = req.query;
    let data = await Admin.list({}, page, size, "-password");
    res.status(data.status).json(data);
    logger.log({level : 'info' , id: req.user.id , role: 'admin', action : 'getAllAdmins',});
}


module.exports = {
    loginAdmin,
    addAdmin,
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    getAllAdmins,
}