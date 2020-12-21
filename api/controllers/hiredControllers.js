const { failedResponse, successResponse } = require("../responses");
const {
  hiredAdded,
  hiredEdit,
  projectAdd,
  hiredLoad,
} = require("../services/hiredServices");

module.exports = {
  addHired: (req, res) => {
    hiredAdded(req, (error, results) => {
      if (error) {
        if (error.details) {
          const details = error.details.map((detail) => detail.message);
          failedResponse(res, error.details[0].message, details);
        }
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, "Added Succesfully", "hired", 201);
      }
    });
  },
  editHired: (req, res) => {
    hiredEdit(req.body, (error, results) => {
      if (error) {
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(
          res,
          results,
          `${req.body.status ? "Approved" : "Declined"}`,
          "hired"
        );
      }
    });
  },
  loadHired: (req, res) => {
    const { id } = req.user;
    hiredLoad(id, (error, results) => {
      if (error) {
        return failedResponse(error);
      }
      successResponse(res, results, "Orders Loaded", "orders");
    });
  },
  addProject: (req, res) => {
    projectAdd(req, (error, results) => {
      if (error) {
        if (error.details) {
          const details = error.details.map((detail) => detail.message);
          return failedResponse(res, error.details[0].message, details);
        }
        failedResponse(res, JSON.stringify(error));
      } else {
        successResponse(res, results, results, "projects", 201);
      }
    });
  },
};
