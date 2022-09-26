module.exports = (app) => {
  const controllers = require("../controllers/user.controller");

  const route = require("express").Router();

  route.post("/login", controllers.login);
  route.post("/register", controllers.create_user);
  route.get("/get_user", controllers.get_profile);
  route.put("/block_user", controllers.block_user);
  route.put("/unblock_user", controllers.unblock_user);
  route.put("/follow_user", controllers.follow_user);
  route.put("/unfollow_user", controllers.unfollow_user);
  route.put("/edit_user", controllers.edit_user);

  app.use("/userApi", route);
};
