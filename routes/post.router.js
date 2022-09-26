module.exports = (app) => {
  const controllers = require("../controllers/post.controllers");

  const route = require("express").Router();

  route.post("/post", controllers.create_post);
  route.post("/like_post", controllers.like_post);
  route.put("/delet_post", controllers.delet_post);
  route.put("/edit_post", controllers.edit_post);
  route.get("/favourite_post", controllers.my_favourite);

  app.use("/postApi", route);
};
