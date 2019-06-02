const express = require('express')
const authMiddleware = require('../middleware/auth')
const newsMiddleware = require('../middleware/newsauth')
const newsMiddlewareQuery = require('../middleware/newsAuthQuery')
const upload = require('../models/upload').single('file')
const Grid = require('gridfs-stream')
const mongoose = require('mongoose')
const File = require('../models/file')

const router = express.Router()


router.post('/',authMiddleware, newsMiddleware,(req,res)=>{
    // req.file.newsid =  req.newsid
    // console.log(req)
    upload( req, res, async ( err ) => {
        if (err){
            return res.status(400).send({error:err.message})
        }else{
            const {originalname,mimetype,filename,size,uploadDate,id} = req.file
            
            
            await File.create({originalname,mimetype,filename,size,uploadDate,newsid:req.newsid,fileid:id})
            res.status(200).json({
                file: req.file
            })
        }
    });
    
})
// router.get('/upload',authMiddleware, newsMiddleware,async (req,res)=>{
//     const data = upload.find(req)
    
// })
// const gfs = Grid(mongoose.connection.db, mongoose.mongo)
// router.get('/upload', async (req, res) => {//rota de teste
//     gfs = Grid(mongoose.connection.db, mongoose.mongo)
//     gfs.collection('uploads')
    

   
// })

router.get('/', (req, res) => {
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

router.get('/name', (req, res) => {         //retorna apenas as imagens com formato png e jpeg
  const {filename} = req.query
  console.log(filename)
  const gfs = Grid(mongoose.connection.db, mongoose.mongo)
  gfs.collection('uploads')

  gfs.files.findOne({ filename}, (err, file) => {
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

router.get('/news',newsMiddlewareQuery,async (req, res) => {
  
  const {newsid} = req.query

  const files = await File.find({newsid})

  res.json(files)
});

router.get('/all', async (req, res) => {
  
	const files = await File.find({})
	const {newsid, fileid} = files
	// console.log(filename)
	res.json(newsid,fileid)
  });

router.delete('/', async (req, res) => {

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



module.exports = app => app.use('/image', router)




// router.post('/upload',authMiddleware, newsMiddleware,upload.single('file'),(req,res)=>{
//     req.file.newsid = req.newsid
//     res.json({file:req.file})
// })