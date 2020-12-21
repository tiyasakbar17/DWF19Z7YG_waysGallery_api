const router = require("express").Router();
const multer = require("multer");
const { addArts } = require("../controllers/artControllers");
const {
  userLogin,
  userRegister,
  loadData,
  editProfile,
  getUserById,
  followHandler,
} = require("../controllers/authControllers");
const {
  addHired,
  editHired,
  addProject,
  loadHired,
} = require("../controllers/hiredControllers");
const { getPhotoById } = require("../controllers/photoControllers");
const {
  getAllPosts,
  getPostById,
  addPost,
  deletePost,
  editPost,
} = require("../controllers/postControllers");
const { jwtAuth } = require("../middlewares/jwtAuth");
const { uploadFiles } = require("../middlewares/uploadFiles");

// Auth User
router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/load", jwtAuth, loadData);
router.patch("/user", jwtAuth, uploadFiles("avatar"), editProfile);
router.get("/user/:id", jwtAuth, getUserById);
router.post("/follow/:userId", jwtAuth, followHandler);

//Posts
router.get("/posts", jwtAuth, getAllPosts);
router.get("/post/:id", jwtAuth, getPostById);
router.post("/post", jwtAuth, uploadFiles("photos"), addPost);
router.delete("/post/:postId", jwtAuth, deletePost);
router.patch("/post/:postId", jwtAuth, editPost);

//Photos
router.get("/photo/:id", jwtAuth, getPhotoById);

//Hired & PROJECTs
router.get("/hired", jwtAuth, loadHired);
router.post("/hired", jwtAuth, addHired);
router.patch("/hired", jwtAuth, editHired);
router.post("/project", jwtAuth, uploadFiles("photos"), addProject); //ADD PRoject

// ARTs
router.post("/art", jwtAuth, uploadFiles("arts"), addArts);

module.exports = router;
