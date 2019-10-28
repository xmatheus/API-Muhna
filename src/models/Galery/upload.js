const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('../../database/index');

let gfs;
mongoose.connection.once('open', () => {
    // init stream
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('galeria');
});

const storage = new GridFsStorage({
    url: mongoose.connection.client.s.url,
    file: (req, file) =>
    // file.newsid  = req.newsid
        new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename,
                    bucketName: 'galeria',
                };
                // fileInfo.newsid = req.newsid

                resolve(fileInfo);
            });
        }),
});

const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpg',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
});

module.exports = upload;
