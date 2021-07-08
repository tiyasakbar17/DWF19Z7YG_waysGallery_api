const { failedResponse, successResponse } = require("../responses");
const {
  loginUser,
  registerUser,
  dataLoad,
  editUser,
  getUser,
  follow,
} = require("../services/authServices");

module.exports = {
  userLogin: (req, res) => {
    loginUser(req.body, (error, results) => {
      if (error) {
        failedResponse(res, error.message, error.details);
      } else {
        successResponse(res, results, "Logged In Succesfully", "user");
      }
    });
  },
  userRegister: (req, res) => {
    registerUser(req.body, (error, results) => {
      if (error) {
        failedResponse(res, error.message, error.details);
      } else {
        successResponse(res, results, "Registered Succesfully", "user");
      }
    });
  },
  loadData: (req, res) => {
    dataLoad(req.user.id, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, "Data Loaded", "user");
      }
    });
  },
  editProfile: (req, res) => {
    editUser(req, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, "Edited Succesfully", "user");
      }
    });
  },
  getUserById: (req, res) => {
    getUser(req.params.id, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, "User Loaded", "user");
      }
    });
  },
  followHandler: (req, res) => {
    follow(req, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, results, "follow");
      }
    });
  },
};
