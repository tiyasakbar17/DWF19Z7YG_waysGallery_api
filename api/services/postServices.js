const Joi = require("joi");
const { user, post, photo } = require("../../models");

module.exports = {
  allPostsGot: async (callBack) => {
    try {
      const AllPosts = await post.findAll({
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: photo,
            as: "photos",
            attributes: {
              exclude: ["updatedAt"],
            },
          },
          {
            model: user,
            as: "createdBy",
            attributes: ["id", "fullName", "avatar", "email"],
          },
        ],
      });
      callBack(null, AllPosts);
    } catch (error) {
      callBack(error);
    }
  },
  postById: async (id, callBack) => {
    try {
      const postGot = await post.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: photo,
            as: "photos",
            attributes: {
              exclude: ["updatedAt"],
            },
          },
          {
            model: user,
            as: "createdBy",
            attributes: ["id", "fullName", "avatar", "email"],
          },
        ],
      });
      if (!postGot) {
        callBack(`Posts with id ${id} is not found`);
      }
      callBack(null, postGot);
    } catch (error) {
      callBack(error);
    }
  },
  postAdded: async (data, callBack) => {
    console.log(data.files);
    try {
      const { title, description } = data.body;
      const photos = data.files.photos;
      const userId = data.user.id;
      const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        photos: Joi.array().required(),
      });

      const newPost = await post.create({ title, description, userId });
      if (!newPost) {
        return callBack("Can't Add Posts");
      }
      const uploadPhotos = async () => {
        return Promise.all(
          photos.map(async (file) => {
            await photo.create({
              image: file.filename,
              postId: newPost.id,
            });
          })
        );
      };
      uploadPhotos().then(async () => {
        const calledposts = await post.findOne({
          where: { id: newPost.id },
          attributes: {
            exclude: ["updatedAt"],
          },
          include: [
            {
              model: photo,
              as: "photos",
              attributes: {
                exclude: ["updatedAt"],
              },
            },
          ],
        });
        callBack(null, calledposts);
      });
    } catch (error) {
      callBack(error);
    }
  },
  postDeleted: async (data, callBack) => {
    try {
      const { id } = data.user;
      const { postId } = data.params;
      const result = await post.destroy({
        where: {
          id: postId,
          userId: id,
        },
      });
      if (!result) {
        return callBack("Server Error");
      }
      callBack(null, "Deleted Succesfully");
    } catch (error) {
      callBack(error);
    }
  },
  postEdited: async (data, callBack) => {
    try {
      const { id } = data.user;
      const { postId } = data.params;
      const result = await post.update(
        { ...data.body },
        {
          where: {
            userId: id,
            id: postId,
          },
        }
      );
      if (!result) {
        return callBack("Server Error");
      }
      callBack(null, "Updated SuccesFully");
    } catch (error) {
      callBack(error);
    }
  },
};
