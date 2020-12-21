const { failedResponse, successResponse } = require("../responses");
const { photoById } = require("../services/photoServices");

module.exports = {
  getPhotoById: (req, res) => {
    photoById(req.params.id, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, "photo loaded", "photo");
      }
    });
  },
};
