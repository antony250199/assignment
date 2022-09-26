const post_model = require("../models/post");
const user_model = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/configuration");
const upload = require("../helpers/helpers");
const jwtSecretKey = "Assignment";

exports.create_post = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let user = await user_model.findOne({ _id: verified.id });
      const image_upload = await upload(req, res, async function () {
        console.log(req.files);
        const files = req.files;
        let file_arr = [];
        for (let i in files) {
          file_arr.push(config.host + files[i].filename);
        }
        let data = {
          post_name: req.body.post_name,
          post_status: req.body.post_status,
          hash_tags: req.body.hash_tags ? req.body.hash_tags.split(",") : [],
          friend_tags: req.body.friend_tags
            ? req.body.friend_tags.split(",")
            : [],
          comments: req.body.comments ? req.body.comments.split(",") : [],
          post_content: file_arr,
          owner: user,
        };
        let post = post_model.create(data);
        if (post) {
          return res.json({ message: "Post created successfully" });
        }
      });
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    return res.json({ message: "Error occured in post creation", error: err });
  }
};

exports.like_post = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post = await post_model.findOne({ _id: req.body.post_id }); //likes: { "$in" : [verified.id]}
      if (post != null) {
        if (!post.likes.includes(verified.id)) {
          post.likes.push(verified.id);
          let like = await post_model.updateOne(
            { _id: req.body.post_id },
            post
          );
          res.json({ message: "Liked successfully" });
        } else {
          res.json({ message: "Already you have liked this post" });
        }
      } else {
        res.json({ message: "Could not find post" });
      }
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong!" });
  }
};

exports.delet_post = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post = await post_model
        .findOne({ _id: req.body.post_id })
        .populate("owner");
      if (post != null) {
        if (post.owner._id == verified.id) {
          let delete_post = await post_model.deleteOne({
            _id: req.body.post_id,
          });
          res.json({ message: "Post deleted successfully" });
        } else {
          res.json({ message: "You aren't having access to delete this post" });
        }
      } else {
        res.json({ message: "Could not find post" });
      }
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong!", error: err });
  }
};

exports.edit_post = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      const image_upload = await upload(req, res, async function () {
        console.log(req.files);
        const files = req.files;
        let file_arr = [];
        for (let i in files) {
          file_arr.push(config.host + files[i].filename);
        }
        let data = {
          post_name: req.body.post_name,
          post_status: req.body.post_status,
          hash_tags: req.body.hash_tags ? req.body.hash_tags.split(",") : [],
          friend_tags: req.body.friend_tags
            ? req.body.friend_tags.split(",")
            : [],
          comments: req.body.comments ? req.body.comments.split(",") : [],
          post_content: file_arr,
        };
        let post = post_model.updateOne({ _id: req.body.post_id }, data);
        return res.json({ message: "Post updated successfully" });
      });
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    return res.json({ message: "Error occured in post updation", error: err });
  }
};

exports.my_favourite = async (req, res) => {
  try {
    let token = req.headers.token;
    let verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      let post = await post_model.findOne({ likes: { $in: [verified.id] } });
      res.json({
        message: "Favourite post list found successfully",
        post: post,
      });
    } else {
      return res.json({ message: "Unauthorized user" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong", error: err });
  }
};
