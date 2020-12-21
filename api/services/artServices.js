const { user, hired, post, photo, art } = require("../../models");
module.exports = {
  artAdd: async (data, callBack) => {
    try {
      const arts = data.files.arts;
      const userId = data.user.id;
      const counter = Promise.all(
        arts.map(async (addedArt) => {
          await art.create({ userId, art: addedArt.filename });
        })
      );
      console.log("NILAICOUNTER", counter);
      if (!counter) {
        return callBack("Server Error");
      }
      callBack(null, "Arts Added");
    } catch (error) {
      callBack(error);
    }
  },
};
