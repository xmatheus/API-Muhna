const mongoose = require("../../database/index");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

let gfs;
mongoose.connection.once("open", () => {
  //init stream
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploadPost");
});

const storage = new GridFsStorage({
  url: mongoose.connection.client.s.url,
  file: (req, file) => {
    // file.newsid  = req.newsid
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          postid: req.postid,
          bucketName: "uploadPost"
        };
        // fileInfo.newsid = req.newsid

        resolve(fileInfo);
      });
    });
  }
});

const uploadPost = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/pjpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/mkv"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      // file.newsid = req.newsid
      // const user =  await User.create(req.body)
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
});

module.exports = uploadPost;
