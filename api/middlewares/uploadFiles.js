const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "tiyasakbar",
  api_key: "655344582134876",
  api_secret: "eITB2ow0qDsXV9RIM-QBxh3jlMw",
});

exports.uploadFiles = (photo1, photo2) => {
  let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

  //UPLOAD
  const uploadFile = async (req, next) => {
    try {
      if (req.files[photo1]) {
        for (let index = 0; index < req.files[photo1].length; index++) {
          let result = await streamUpload(req.files[photo1][index].buffer);
          req.files[photo1][index].filename = result.url;
        }
      }
      if (req.files[photo2]) {
        for (let index = 0; index < req.files[photo2].length; index++) {
          let result = await streamUpload(req.files[photo2][index].buffer);
          req.files[photo2][index].filename = result.url;
        }
      }
      return next();
    } catch (error) {
      console.log(error);
    }
  };

  //Seleksi extension file
  const fileFilter = (req, file, cb) => {
    const fileType = /jpeg|jpg|png|gif|svg/;
    if (!fileType.test(path.extname(file.originalname).toLowerCase())) {
      req.errorMessege = {
        message: "Wrong Type of File",
      };
      return cb(new Error("Wrong Type of File"), false);
    }
    cb(null, true);
  };

  //Upload Multer
  const upload = multer({
    fileFilter,
    limits: {
      fileSize: 5242880, //(Mb) => 5 x 1024 x 1024
    },
  }).fields([{ name: photo1 }, { name: photo2 }]);

  return (req, res, next) => {
    upload(req, res, (error) => {
      if (req.errorMessege) {
        uploadFailedResponse(res, req.errorMessege.message);
      }
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          uploadFailedResponse(res, "The file must be less than 5 Mb");
        }
      }
      return uploadFile(req, next);
    });
  };
};
