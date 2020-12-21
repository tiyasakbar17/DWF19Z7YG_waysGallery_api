module.exports = {
  successResponse: (res, results, message, key, status = 200) => {
    return res.status(status).json({
      status: "success",
      message,
      data: {
        [key]: results,
      },
    });
  },
  failedResponse: (res, message, details, status = 400) => {
    return res.status(status).json({
      status: "failed",
      message,
      details,
    });
  },
};
