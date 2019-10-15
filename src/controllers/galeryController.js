/* eslint-disable radix */
/* eslint-disable consistent-return */
const express = require('express');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

const authMiddleware = require('../middleware/auth');
const File = require('../models/Galery/file');
const upload = require('../models/Galery/upload').single('file');

const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        const {
            originalname,
            contentType,
            filename,
            size,
            uploadDate,
            id,
        } = req.file;

        await File.create({
            originalname,
            contentType,
            filename,
            size,
            uploadDate,
            fileid: id,
        }); // File eh o que linka o arquivo a notica
        res.status(200).json({
            file: req.file,
        });
    });
});

router.get('/', authMiddleware, async (req, res) => {
    const { page = 1, limite = 10 } = req.query;

    const limit = parseInt(limite);

    const files = await File.paginate(
        {},
        {
            page,
            limit,
            sort: {
                createAt: -1, //  Sort by Date Added DESC
            },
        },
    );

    return res.status(200).send(files);
});

router.delete('/', authMiddleware, async (req, res) => {
    const { idfile } = req.query;
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);

    try {
        await File.deleteMany({ fileid: idfile });
        await gfs.remove({ _id: idfile, root: 'galeria' });
    } catch (error) {
        res.status(400).send(error);
    }
    res.status(200).send();
});

router.get('/image', (req, res) => {
    // retorna apenas imagens contendo o filename passado como query
    const { filename } = req.query;
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('galeria');

    gfs.files.findOne({ filename }, (err, file) => {
    // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists',
            });
        }

        // Check if image
        if (
            file.contentType === 'image/jpeg'
      || file.contentType === 'image/png'
      || file.contentType === 'image/pjpeg'
      || file.contentType === 'image/gif'
        ) {
            // verificar se o contenttype
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image',
            });
        }
    });
});

module.exports = (app) => app.use('/galery', router);
