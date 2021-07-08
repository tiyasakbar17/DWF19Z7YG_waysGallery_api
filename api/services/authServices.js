const { user, follow, post, photo, art } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

module.exports = {
  loginUser: async (data, callBack) => {
    try {
      const { email, password } = data;
      const schema = Joi.object({
        email: Joi.string().min(5).email().required(),
        password: Joi.string().min(6).required(),
      });
      const { error } = schema.validate({ ...data }, { abortEarly: false });

      if (error) {
        const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
        return callBack({message: error.details[0].message.split('"').join("").split("\\").join(""), details});
      }

      const cekEmail = await user.findOne({
        where: {
          email,
        },
      });
      const validatingPassword = await bcrypt.compare(
        password,
        cekEmail.password
      );

      if (!cekEmail || !validatingPassword) {
        return callBack({message: "Check Your Email Or Password"});
      } else {
        const userData = {
          id: cekEmail.id,
          email: cekEmail.email,
        };
        jwt.sign(userData, process.env.SECRET_KEY, (error, token) => {
          if (error) {
            console.log(error);
            return callBack({message: JSON.stringify(error)});
          } else {
            const resultToSend = {
              email,
              token,
            };
            return callBack(null, resultToSend);
          }
        });
      }
    } catch (error) {
      callBack({message: "Check Your Email Or Password"});
    }
  },
  registerUser: async (data, callBack) => {
    try {
      const { email, password } = data;
      try {
        const schema = Joi.object({
          fullName: Joi.string().min(2).required(),
          email: Joi.string().min(5).email().required(),
          password: Joi.string().min(6).required(),
        });

        const { error } = schema.validate({ ...data }, { abortEarly: false });

        if (error) {
          const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
          return callBack({message: error.details[0].message.split('"').join("").split("\\").join(""), details});
        } else {
          const checkEmail = await user.findOne({
            where: {
              email,
            },
          });

          if (checkEmail) {
            callBack({message: "Use Another Email"});
          } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
              ...data,
              password: hashedPassword,
            };
            const userDatas = await user.create(newUser);

            const tokenPayload = {
              id: userDatas.id,
              email: userDatas.email,
            };
            jwt.sign(
              tokenPayload,
              process.env.SECRET_KEY,
              {
                expiresIn: 86400,
              },
              (error, token) => {
                if (error) {
                  console.log(error);
                  return callBack({message: JSON.stringify(error)});
                } else {
                  return callBack(null, token);
                }
              }
            );
          }
        }
      } catch (error) {
        console.log(error);
        return callBack({message: JSON.stringify(error)});
      }
    } catch (error) {
      return callBack({message: JSON.stringify(error)});
    }
  },
  dataLoad: async (data, callBack) => {
    try {
      const calledUser = await user.findOne({
        where: { id: data },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "token"],
        },
        include: [
          {
            model: post,
            as: "posts",
            attributes: {
              exclude: ["updatedAt"],
            },
          },
          {
            model: follow,
            as: "following",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
          {
            model: follow,
            as: "followers",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
      });
      callBack(null, calledUser);
    } catch (error) {
      callBack(error);
    }
  },
  editUser: async (data, callBack) => {
    try {
      const {
        body,
        files,
        user: { id },
      } = data;
      const schema = Joi.object({
        fullName: Joi.string().min(2),
        greeting: Joi.string(),
        avatar: Joi.string(),
      });

      const calledUser = await user.findOne({
        where: {
          id,
        },
      });

      const validataData = {
        ...body,
        avatar: !files.avatar ? calledUser.avatar : files.avatar[0].filename,
      };

      const userDatas = await user.update(validataData, {
        where: {
          id,
        },
      });
      if (!userDatas) {
        return callBack("Server Error");
      }
      const resultToShow = await user.findOne({
        where: {
          id,
        },
        attributes: ["fullName", "id", "greeting", "avatar"],
      });
      callBack(null, resultToShow);
    } catch (error) {
      callBack(JSON.stringify(error));
    }
  },
  getUser: async (data, callBack) => {
    try {
      const calledUser = await user.findOne({
        where: { id: data },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password", "token"],
        },
        include: [
          {
            model: post,
            as: "posts",
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
          },
          {
            model: art,
            as: "arts",
            attributes: {
              exclude: ["updatedAt"],
            },
          },
          {
            model: follow,
            as: "following",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
          {
            model: follow,
            as: "followers",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
      });
      callBack(null, calledUser);
    } catch (error) {
      callBack(error);
    }
  },
  follow: async (data, callBack) => {
    try {
      const { id } = data.user;
      const { userId } = data.params;
      const result = await follow.findOne({
        where: {
          followedBy: id,
          followTo: userId,
        },
      });
      if (!result) {
        const following = await follow.create({
          followedBy: id,
          followTo: userId,
        });
        if (!following) {
          return callBack("Server Error");
        }
        return callBack(null, "Followed");
      }
      const unfollow = await follow.destroy({
        where: {
          followedBy: id,
          followTo: userId,
        },
      });
      if (!unfollow) {
        return callBack("Server Error");
      }
      return callBack(null, "Unfollowed");
    } catch (error) {
      callBack(error);
    }
  },
};
