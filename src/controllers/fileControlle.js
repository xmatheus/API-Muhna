const express = require('express')
const authMiddleware = require('../middleware/auth')
const newsMiddleware = require('../middleware/newsauth')
const newsMiddlewareQuery = require('../middleware/newsAuthQuery')
const upload = require('../models/upload').single('file')
const Grid = require('gridfs-stream')
const mongoose = require('mongoose')
const File = require('../models/file')

const router = express.Router()


router.post('/',authMiddleware, newsMiddleware,(req,res)=>{		//upload de midia 
    // req.file.newsid =  req.newsid
    // console.log(req)
    upload( req, res, async ( err ) => {
        if (err){
            return res.status(400).send({error:err.message})
        }else{
            const {originalname,mimetype,filename,size,uploadDate,id} = req.file
            
            
            await File.create({originalname,mimetype,filename,size,uploadDate,newsid:req.newsid,fileid:id})		//File eh o que linka o arquivo a notica
            res.status(200).json({
                file: req.file
            })
        }
    });
    
})

router.get('/', authMiddleware, (req, res) => {		//mostra todas as imagens
    const gfs = Grid(mongoose.connection.db, mongoose.mongo)
    gfs.collection('uploads')
    gfs.files.find({}).toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Files exist
        return res.json(files);
    });
});

router.get('/image', (req, res) => {         //retorna apenas imagens contendo o filename passado como query
	const { filename } = req.query
	console.log(filename)
	const gfs = Grid(mongoose.connection.db, mongoose.mongo)
	gfs.collection('uploads')

	gfs.files.findOne({ filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: 'No file exists'
			});
		}

		// Check if image
		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
			// Read output to browser
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		} else {
			res.status(404).json({
				err: 'Not an image'
			});
		}
	});
});

router.get('/video', (req, res) => {         //retorna apenas imagens contendo o filename passado como query
	const { filename } = req.query
	
	console.log(filename)
	const gfs = Grid(mongoose.connection.db, mongoose.mongo)
	gfs.collection('uploads')

	gfs.files.findOne({ filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: 'No file exists'
			});
		}

		// Check if video
		if (file.contentType === 'image/gif' || file.contentType === 'video/mp4' || file.contentType === 'video/mkv') {
			
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		} else {
			res.status(404).json({
				err: 'Not an video'
			});
		}
	});
});



router.get('/news', newsMiddlewareQuery, async (req, res) => {    // mostra as imagens rerente a noticia

	const { newsid } = req.query

	const files = await File.find({ newsid })

	res.json(files)
});

router.get('/all', authMiddleware, async (req, res) => {   //mostra todas as imagens

	const files = await File.find({})
	res.status(200).send(files)
});

router.delete('/', authMiddleware,async (req, res) => {

	const { imageid } = req.query
	const gfs = Grid(mongoose.connection.db, mongoose.mongo)

	try {
		await File.deleteMany({ fileid: imageid })
		await gfs.remove({ _id: imageid, root: 'uploads' })
	} catch (error) {
		res.status(400).send(error)
	}
	res.status(200).send()
});



module.exports = app => app.use('/file', router)
