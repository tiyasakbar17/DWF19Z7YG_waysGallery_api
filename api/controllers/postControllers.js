const { failedResponse, successResponse } = require("../responses");
const {
  allPostsGot,
  postById,
  postAdded,
  postDeleted,
  postEdited,
} = require("../services/postServices");

module.exports = {
  getAllPosts: (req, res) => {
    allPostsGot((error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, "Posts Loaded", "posts");
      }
    });
  },
  getPostById: (req, res) => {
    const { id } = req.params;
    postById(id, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, `Posts with id ${id} Loaded`, "post");
      }
    });
  },
  addPost: (req, res) => {
    postAdded(req, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, `Post Added`, "post");
      }
    });
  },
  deletePost: (req, res) => {
    postDeleted(req, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(
          res,
          results,
          `Posts with id ${req.params.postId} deleted`,
          "post"
        );
      }
    });
  },
  editPost: (req, res) => {
    postEdited(req, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, `Post Updated`, "post");
      }
    });
  },
};
