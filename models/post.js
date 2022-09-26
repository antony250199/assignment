const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  post_name: String,
  post_content: Array,
  post_status:{
    type: String,
    enum: {
      values: ['public', 'private'],
      message: 'Profile must be public or private'
    }
  },
  hash_tags: Array,
  friend_tags: Array,
  comments:Array,
  likes:Array,
  owner:{ type: mongoose.Types.ObjectId, ref: 'users' }
})

const post = mongoose.model('posts', postSchema)
module.exports = post
