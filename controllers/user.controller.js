const express = require("express");
const usermodel = require("../models/user");
const jwt = require("jsonwebtoken");
const post_model = require("../models/post");
const { set } = require("mongoose");

const jwt_secret = "Assignment";

exports.login = async (req, res) => {
  try {
    let user = await usermodel.findOne({ email_id: req.body.email_id });
    if (user != null) {
      if (req.body.password == user.password) {
        var token = jwt.sign({ id: user._id }, jwt_secret);
        res.json({
          status: 1,
          msg: "login success",
          user: user,
          token: token,
        });
      } else {
        res.json({ message: "Incorrect password" });
      }
    } else {
      res.json({ message: "Entered email does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Unable to login user", error: err });
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
};

exports.create_user = async (req, res) => {
  let data = {
    name: req.body.name,
    email_id: req.body.email_id,
    password: req.body.password,
    user_name: req.body.user_name,
    mobile: req.body.mobile,
    gender: req.body.gender,
    profile: req.body.profile,
  };
  try {
    let exist_user = await usermodel.findOne({
      $or: [
        { email_id: req.body.email_id },
        { user_name: req.body.user_name },
        { mobile: req.body.mobile },
      ],
    });
    if (exist_user == null) {
      let user = await usermodel.create(data);
      if (user) {
        res.json({ message: "User registered successfully" });
      }
    } else if (exist_user.email_id == req.body.email_id) {
      res.json({ message: "Entered email already exist" });
    } else if (exist_user.user_name == req.body.user_name) {
      res.json({ message: "Entered username already exist" });
    } else if (exist_user.mobile == req.body.mobile) {
      res.json({ message: "Entered mobile number already exist" });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      res.json({
        message: Object.values(err.errors).map((val) => val.message),
      });
    } else {
      res.json({ message: "Unable to register new user", error: err });
    }
  }
};

exports.get_profile = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwt_secret);
    if (verified) {
      let profile = {
        details: null,
        followers: 0,
        followings: 0,
        liked_users: [],
        post_count: 0,
      };
      let user = await usermodel.findOne({ _id: req.body.user_id });
      profile.details = user;
      profile.followings = user.followers.length;
      let followers = await usermodel.find({
        followers: { $in: [req.body.user_id] },
      });
      profile.followers = followers.length;
      let posts = await post_model.find({ owner: user });
      if (posts.length > 0) {
        profile.post_count = posts.length;
        let user_list = [];
        posts.forEach((e) => {
          user_list = user_list.concat(e.likes);
        });
        let liked_users = await usermodel.find({ _id: { $in: user_list } });
        profile.liked_users = liked_users;
      }
      res.json({ message: "Profile found successfully", profile: profile });
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Something went wrong!" });
  }
};

exports.block_user = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwt_secret);
    if (verified) {
      let user = await usermodel.findOne({ _id: verified.id });
      user.blocked_users.push(req.body.block_user);
      let update = await usermodel.updateOne({ _id: verified.id }, user);
      res.json({ message: "User blocked successfully" });
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong!" });
  }
};

exports.unblock_user = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwt_secret);
    if (verified) {
      let user = await usermodel.findOne({ _id: verified.id });
      user.blocked_users = user.blocked_users.filter(
        (e) => e != req.body.unblock_user
      );
      let update = await usermodel.updateOne({ _id: verified.id }, user);
      res.json({ message: "User unblocked successfully" });
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong!" });
  }
};

exports.follow_user = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwt_secret);
    if (verified) {
      let user = await usermodel.findOne({ _id: verified.id });
      user.followers.push(req.body.follower);
      let update = await usermodel.updateOne({ _id: verified.id }, user);
      res.json({ message: "Followed successfully" });
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong!" });
  }
};

exports.unfollow_user = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwt_secret);
    if (verified) {
      let user = await usermodel.findOne({ _id: verified.id });
      user.followers = user.followers.filter((e) => e != req.body.unfollow);
      let update = await usermodel.updateOne({ _id: verified.id }, user);
      res.json({ message: "User unfollowed successfully" });
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong!" });
  }
};

exports.edit_user = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwt_secret);
    if (verified) {
      let data = {
        name: req.body.name,
        email_id: req.body.email_id,
        password: req.body.password,
        user_name: req.body.user_name,
        mobile: req.body.mobile,
        gender: req.body.gender,
        profile: req.body.profile,
      };
      let exist_user = await usermodel.findOne({
        $or: [
          { email_id: req.body.email_id },
          { user_name: req.body.user_name },
          { mobile: req.body.mobile },
        ],
      });
      if (exist_user == null) {
        let update = await usermodel.updateOne({ _id: verified.id }, data);
        res.json({ message: "User updated successfully" });
      } else if (exist_user.email_id == req.body.email_id) {
        res.json({ message: "Entered email already exist" });
      } else if (exist_user.user_name == req.body.user_name) {
        res.json({ message: "Entered username already exist" });
      } else if (exist_user.mobile == req.body.mobile) {
        res.json({ message: "Entered mobile number already exist" });
      }
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong!" });
  }
};
