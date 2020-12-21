const Joi = require("joi");
const {
  user,
  hired,
  project,
  projectPhoto,
  Sequelize,
} = require("../../models");

module.exports = {
  hiredAdded: async (data, callBack) => {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        price: Joi.number().required(),
        orderTo: Joi.number().required(),
        orderBy: Joi.number().required(),
      });
      const newData = {
        ...data.body,
        orderBy: data.user.id,
      };
      console.log(newData);

      const addHired = await hired.create(newData);
      const newHired = await hired.findOne({
        where: {
          id: addHired.id,
        },
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: user,
            as: "hires",
            attributes: ["id", "fullName", "email"],
          },
          {
            model: user,
            as: "offers",
            attributes: ["id", "fullName", "email"],
          },
        ],
      });
      callBack(null, newHired);
    } catch (error) {
      callBack(error);
    }
  },
  hiredEdit: async (data, callBack) => {
    try {
      const result = await hired.update(
        { status: data.status },
        {
          where: { id: data.id },
        }
      );
      callBack(null, result);
    } catch (error) {
      callBack(error);
    }
  },
  projectAdd: async (data, callBack) => {
    try {
      const photos = data.files.photos;
      const { hiredId, description } = data.body;

      const newProject = await project.create({
        hiredId,
        description,
      });

      if (!newProject) {
        return callBack("Server Error");
      }

      const addPhoto = async () => {
        return Promise.all(
          photos.map(async (file) => {
            await projectPhoto.create({
              photo: file.filename,
              projectId: newProject.id,
            });
          })
        );
      };

      addPhoto().then(async () => {
        callBack(null, "Project Added");
      });
    } catch (error) {
      callBack(error);
    }
  },
  hiredLoad: async (data, callBack) => {
    try {
      const calledHired = await hired.findAll({
        where: Sequelize.or({ orderBy: data }, { orderTo: data }),
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: user,
            as: "hires",
            attributes: ["id", "fullName", "email"],
          },
          {
            model: user,
            as: "offers",
            attributes: ["id", "fullName", "email"],
          },
          {
            model: project,
            as: "project",
            attributes: { exclude: ["updatedAt"] },
            include: [
              {
                model: projectPhoto,
                as: "photos",
                attributes: {
                  exclude: ["updatedAt"],
                },
              },
            ],
          },
        ],
      });
      if (!calledHired) {
        return callBack("No Data Founded");
      }
      callBack(null, calledHired);
    } catch (error) {
      callBack(error);
    }
  },
};
