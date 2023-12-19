const jwt = require("jsonwebtoken");
const User = require('../models/usersModel');
const verifyToken = async (req, res, next) => {
  let responseData={};
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    responseData={
        data:{
            statusCode:419,
            message:'Authrization faild',
        },
        code:419
    }
    return errorResponse(req,res,responseData)
    
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    if (decoded.role.some(data=>data.name==='Admin')) {
      reqData= await User.findOne({_id:decoded._id}).populate('role')
      if (reqData) {
        req.user = {
          _id:reqData._id,
          name:reqData.name,
          email:reqData.email,
          phone_no:reqData.phone_no,
          pro_image:reqData.pro_image,
          role:reqData.role
        };
        return next();
      }else{
        responseData={
          data:{
              statusCode:419,
              message:'Authrization faild',
          },
          code:419
        }
        return errorResponse(req,res,responseData)
        // throw new Error('not valid user');
      }
    }else{
        responseData={
          data:{
              statusCode:419,
              message:'Authrization faild',
          },
          code:419
        }
        return errorResponse(req,res,responseData)
      }
  } catch (err) {
        console.log('token errror',err);
        responseData={
            data:{
                statusCode:419,
                message:'Authrization faild',
            },
            code:419
        }
        return errorResponse(req,res,responseData)
  }
};
const verifyTokenVendor = async (req, res, next) => {
  let responseData={};
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    responseData={
        data:{
            statusCode:419,
            message:'Authrization faild',
        },
        code:419
    }
    return errorResponse(req,res,responseData)
    
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    if (decoded.role.some(data=>data.name==='Vendor')) {
      reqData= await User.findOne({_id:decoded._id,status:true}).populate('role')
      if (reqData) {
        req.user = {
          _id:reqData._id,
          name:reqData.name,
          email:reqData.email,
          phone_no:reqData.phone_no,
          pro_image:reqData.pro_image,
          role:reqData.role
        };
        return next();
      }else{
        responseData={
          data:{
              statusCode:419,
              message:'Authrization faild',
          },
          code:419
        }
        return errorResponse(req,res,responseData)
        // throw new Error('not valid user');
      }
    }else{
      responseData={
        data:{
            statusCode:419,
            message:'Authrization faild',
        },
        code:419
      }
      return errorResponse(req,res,responseData)
    }
  } catch (err) {
        console.log('token errror',err);
        responseData={
            data:{
                statusCode:419,
                message:'Authrization faild',
            },
            code:419
        }
        return errorResponse(req,res,responseData)
  }
};
const varifyTokenUser = async (req,res,next) => {
  let responseData={};
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    responseData={
        data:{
            statusCode:419,
            message:'Authrization faild',
        },
        code:419
    }
    return errorResponse(req,res,responseData)
    
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    if (decoded.role.some(data=>data.name==='User')) {
      reqData= await User.findOne({_id:decoded._id,status:true}).populate('role')
      if (reqData) {
        req.user = {
          _id:reqData._id,
          name:reqData.name,
          email:reqData.email,
          phone_no:reqData.phone_no,
          role:reqData.role,
          dob:reqData.user_profile.dob
        };
        return next();
      }else{
        responseData={
          data:{
              statusCode:419,
              message:'Authrization faild',
          },
          code:419
        }
        return errorResponse(req,res,responseData)
        // throw new Error('not valid user');
      }
    }else{
      responseData={
        data:{
            statusCode:419,
            message:'Authrization faild',
        },
        code:419
      }
      return errorResponse(req,res,responseData)
    }
  } catch (err) {
        console.log('token errror',err);
        responseData={
            data:{
                statusCode:419,
                message:'Authrization faild',
            },
            code:419
        }
        return errorResponse(req,res,responseData)
  }
}
const varifyTokenDriver = async (req,res,next) => {
  let responseData={};
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    responseData={
        data:{
            statusCode:419,
            message:'Authrization faild',
        },
        code:419
    }
    return errorResponse(req,res,responseData)
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    if (decoded.role.some(data=>data.name==='Driver')) {
      reqData= await User.findOne({_id:decoded._id,status:true}).populate('role')
      if (reqData) {
        req.user = {
          _id:reqData._id,
          name:reqData.name,
          email:reqData.email,
          location:reqData.driver_profile.currentLocation,
          income:reqData.driver_profile.income
        };
        return next();
      }else{
        responseData={
          data:{
              statusCode:419,
              message:'Authrization faild',
          },
          code:419
        }
        return errorResponse(req,res,responseData)
        // throw new Error('not valid user');
      }
    }else{
      responseData={
        data:{
            statusCode:419,
            message:'Authrization faild',
        },
        code:419
      }
      return errorResponse(req,res,responseData)
    }
  } catch (err) {
        console.log('token errror',err);
        responseData={
            data:{
                statusCode:419,
                message:'Authrization faild',
            },
            code:419
        }
        return errorResponse(req,res,responseData)
  }
}

module.exports = {verifyToken,verifyTokenVendor,varifyTokenUser,varifyTokenDriver};