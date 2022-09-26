let Razorpay=require('razorpay');

const RazorpayConfig={
    key_id: 'rzp_test_X7GKwNIabUxCZD',
    key_secret: 'mjLF6yktMhspEGjA0s8SolKb'
  }

  var instance= new Razorpay(RazorpayConfig)

  module.exports.config = RazorpayConfig;
  module.exports.instance = instance;