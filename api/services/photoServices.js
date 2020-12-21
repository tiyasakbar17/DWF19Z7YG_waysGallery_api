const { user, hired, post, photo } = require("../../models");

module.exports = {
  photoById: async (data, callBack) => {
    try {
      const result = await photo.findOne({
        where: {
          id: data,
        },
      });
      if (!result) {
        return callBack("NO POST WHIT THAT ID");
      }
      callBack(null, result);
    } catch (error) {
      callBack(error);
    }
  },
};
