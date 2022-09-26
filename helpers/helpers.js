const util = require('util')
const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads') //path.join(`${__dirname}/../uploads`)
  },
  filename: (req, file, callback) => {
    const match = [
      'image/png',
      'image/jpeg',
      'image/PNG',
      'image/JPEG',
      'application/pdf',
      'video/mpeg',
      'video/mp4',
      'video/x-msvideo',
      'video/ogg'
    ]
    if (match.indexOf(file.mimetype) === -1) {
      console.log('invalid mime')
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`
      return callback(message, null)
    }

    var filename = `${Date.now()}-postApp-${file.originalname}`

    callback(null, filename)
  },
})

var uploadFiles = multer({ storage: storage }).array('post_contents', 10)
var uploadFilesMiddleware = util.promisify(uploadFiles)
module.exports = uploadFilesMiddleware
