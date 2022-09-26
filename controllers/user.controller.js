const express = require('express')
const usermodel = require('../models/user')
const jwt = require('jsonwebtoken')

const jwt_secret = 'Assignment'

exports.login = async (req, res) => {
  try{
    let user = await usermodel.findOne({email_id:req.body.email_id})
    if(user!=null){
      if (req.body.password == user.password) {
        var token = jwt.sign({ id: user._id }, jwt_secret)
        res.json({
          status: 1,
          msg: 'login success',
          user: user,
          token: token,
        })
      } else {
        res.json({ message: 'Incorrect password' })
      }
    }else{
      res.json({message:"Entered email does not exist"})
    }
  }catch(err){
    console.log(err)
    res.json({ message: 'Unable to login user', error:err })
  }
  // usermodel.findOne({ email_id:req.body.email_id }, (err, result) => {
  //   if (err) {
  //     res.json({ status: 0, error: 1 })
  //   } else {
  //     if (result == null) {
  //       res.json({ status: 0, msg: 'user does not exist' })
  //     } else {
  //       if (req.body.password == result.password) {
  //         var token = jwt.sign({ id: result._id }, jwt_secret)
  //         res.json({
  //           status: 1,
  //           msg: 'login success',
  //           user: result,
  //           token: token,
  //         })
  //       } else {
  //         res.json({ status: 0, msg: 'incorrect password' })
  //       }
  //     }
  //   }
  // })
}

exports.get_user_list = (req, res) => {
  const token = req.headers.token
  jwt.verify(token, jwt_secret, async (err, decoded) => {
    if (err) {
      res.json({
        message: 'Unauthorised user',
        error: err,
      })
    } else {
      usermodel.find((err, result) => {
        if (err) {
          res.json({ status: 0, error: err })
        } else {
          res.json({ status: 1, userlist: result })
        }
      })
    }
  })
}

exports.create_user = async (req, res) => {
    let data = {
      name:req.body.name,
      email_id:req.body.email_id,
      password:req.body.password,
      user_name:req.body.user_name,
      mobile:req.body.mobile,
      gender:req.body.gender,
      profile:req.body.profile,
    }
    try{
      let exist_user = await usermodel.findOne({$or: [{'email_id':req.body.email_id}, {'user_name':req.body.user_name},{'mobile':req.body.mobile}]})
      if(exist_user==null){
        let user = await usermodel.create(data)
        if(user){
          res.json({message:'User registered successfully'})
        }
      }else if(exist_user.email_id==req.body.email_id){
        res.json({message:'Entered email already exist'})
      }else if(exist_user.user_name==req.body.user_name){
        res.json({message:'Entered username already exist'})
      }else if(exist_user.mobile==req.body.mobile){
        res.json({message:'Entered mobile number already exist'})
      }
    }catch(err){
      if (err.name === 'ValidationError') {
          res.json({ message: Object.values(err.errors).map(val => val.message) })
      }else{
        res.json({ message: 'Unable to register new user', error:err })
      }
    }
}
