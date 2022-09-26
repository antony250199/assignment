const mongoose = require('mongoose')
const autoIncrement = require("mongoose-auto-increment");

const userSchema = new mongoose.Schema({
  name: String,
  user_id: Number,
  email_id:{
    type:String,
    required: [true,'User email ID is required'],
    validate: {
      validator: function(v) {
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email ID!`
    },
    lowercase: [true, 'Email must be in lower case'],
  },
  password: {
    type:String,
    validate: {
      validator: function(v) {
        // [-a-zA-Z0-9!@#$&()`.+,/\"]*$
        return /^([A-Z]{1,})+([ A-Za-z0-9_@./#&+-]*$)/.test(v);
        // return /^[ A-Za-z0-9_@./#&+-]*$/.test(v);
      },
      message: props => `Please enter a valid password`
    },
    minLength: [8, 'Password must contains atleast 8 characters'],
  },
  user_name: {
    type:String,
  },
  mobile:{
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender name must be male, female or other'
    }
  },
  profile: {
    type: String,
    enum: {
      values: ['public', 'private'],
      message: 'Profile must be public or private'//{VALUE} is not supported
    }
  },
})

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, {
  model: "users", // collection or table name in which you want to apply auto increment
  field: "user_id", // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});
const user = mongoose.model('users', userSchema)
module.exports = user
