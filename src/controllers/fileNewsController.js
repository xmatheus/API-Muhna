const express = require("express");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

const authMiddleware = require("../middleware/auth");
const newsMiddlewareQuery = require("../middleware/newsAuthQuery");
const File = require("../models/News/file");
const upload = require("../models/News/upload").single("file");

const router = express.Router();

router.post("/", authMiddleware, newsMiddlewareQuery, (req, res) => {
	//upload de midia
	// req.file.newsid =  req.newsid
	// console.log(req)
	upload(req, res, async err => {
		if (err) {
			return res.status(400).send({ error: err.message });
		} else {
			const {
				originalname,
				contentType,
				filename,
				size,
				uploadDate,
				id
			} = req.file;

			await File.create({
				originalname,
				contentType,
				filename,
				size,
				uploadDate,
				newsid: req.newsid,
				fileid: id
			}); //File eh o que linka o arquivo a notica
			res.status(200).json({
				file: req.file
			});
		}
	});
});

router.get("/", authMiddleware, (req, res) => {
	//mostra todos os arquivos
	const gfs = Grid(mongoose.connection.db, mongoose.mongo);
	gfs.collection("uploads");
	gfs.files.find({}).toArray((err, files) => {
		// Check if files
		if (!files || files.length === 0) {
			return res.status(404).json({
				err: "No files exist"
			});
		}

		// Files exist
		return res.json(files);
	});
});

router.get("/image", (req, res) => {
	//retorna apenas imagens contendo o filename passado como query
	const { filename } = req.query;
	console.log(filename);
	const gfs = Grid(mongoose.connection.db, mongoose.mongo);
	gfs.collection("uploads");

	gfs.files.findOne({ filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: "No file exists"
			});
		}

		// Check if image
		if (
			file.contentType === "image/jpeg" ||
			file.contentType === "image/png"
		) {
			// verificar se eh mimetype ou contenttype
			// Read output to browser
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		} else {
			res.status(404).json({
				err: "Not an image"
			});
		}
	});
});

router.get("/video", (req, res) => {
	//retorna apenas os videos contendo o filename passado como query
	const { filename } = req.query;

	console.log(filename);
	const gfs = Grid(mongoose.connection.db, mongoose.mongo);
	gfs.collection("uploads");

	gfs.files.findOne({ filename }, (err, file) => {
		if (err) {
			return res.status(400).send({
				err
			});
		}
		if (!file) {
			return res.status(404).send({
				err: "Arquivo nao encontrado"
			});
		}

		if (req.headers["range"]) {
			var parts = req.headers["range"].replace(/bytes=/, "").split("-");
			var partialstart = parts[0];
			var partialend = parts[1];

			var start = parseInt(partialstart, 10);
			var end = partialend ? parseInt(partialend, 10) : file.length - 1;
			var chunksize = end - start + 1;

			res.writeHead(206, {
				"Accept-Ranges": "bytes",
				"Content-Length": chunksize,
				"Content-Range":
					"bytes " + start + "-" + end + "/" + file.length,
				"Content-Type": file.contentType
			});

			gfs.createReadStream({
				filename: file.filename,
				range: {
					startPos: start,
					endPos: end
				}
			}).pipe(res);
		} else {
			res.header("Content-Length", file.length);
			res.header("Content-Type", file.contentType);

			gfs.createReadStream({
				filename: file.filename
			}).pipe(res);
		}
	});
});

router.get("/news", newsMiddlewareQuery, async (req, res) => {
	// mostra as imagens rerente a noticia

	const { newsid } = req.query;

	const old_files = await File.find({ newsid });

	const files = {
		image: [],
		video: []
	};

	old_files.forEach(file => {
		if (
			file.contentType === "image/gif" ||
			file.contentType === "video/mp4" ||
			file.contentType === "video/mkv"
		) {
			files.video.push(file);
		} else if (
			file.contentType === "image/jpeg" ||
			file.contentType === "image/png"
		) {
			files.image.push(file);
		}
	});

	res.json(files);
});

router.get("/all", authMiddleware, async (req, res) => {
	//mostra todas as imagens

	const files = await File.find({});
	res.status(200).send(files);
});

router.delete("/", authMiddleware, async (req, res) => {
	const { idfile } = req.query;
	const gfs = Grid(mongoose.connection.db, mongoose.mongo);

	try {
		await File.deleteMany({ fileid: idfile });
		await gfs.remove({ _id: idfile, root: "uploads" });
	} catch (error) {
		res.status(400).send(error);
	}
	res.status(200).send();
});

module.exports = app => app.use("/fileNews", router);
