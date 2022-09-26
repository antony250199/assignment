module.exports = (app) => {
  const controllers = require('../controllers/user.controller')

  const route = require('express').Router()

  route.post('/login', controllers.login)
  route.post('/register', controllers.create_user)
  route.get('/get_users', controllers.get_user_list)

  app.use('/userApi', route)
}
