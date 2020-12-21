const { failedResponse, successResponse } = require("../responses");
const { artAdd } = require("../services/artServices");

module.exports = {
  addArts: (req, res) => {
    console.log("CEKFILEES", req.files);
    artAdd(req, (error, results) => {
      if (error) {
        if (error.details) {
          const details = error.details.map((detail) => detail.message);
          return failedResponse(res, error.details[0].message, details);
        }
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, results, "arts", 201);
      }
    });
  },
};
