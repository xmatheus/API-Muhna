const express = require("express");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

const User = require("../models/User");
const News = require("../models/News/news");
const authMiddleware = require("../middleware/auth");
const newsAuthQuery = require("../middleware/newsAuthQuery");
const File = require("../models/News/file");

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, resume, news } = req.body;

    const nova = await News.create({
      title,
      resume,
      news,
      userId: req.userId
    });
    return res.status(200).send(nova);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "create news failed" });
  }
});

router.put("/update", authMiddleware, newsAuthQuery, async (req, res) => {
  try {
    const { title, resume, news } = req.body;

    const nova = await News.findByIdAndUpdate(req.newsid, {
      title,
      resume,
      news
    });
    return res.status(200).send({ ok: "updated news" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "update news failed" });
  }
});

router.get("/", async (req, res) => {
  const { newsid } = req.query;

  if (newsid) {
    const nNews = await News.findById({ _id: newsid });
    return res.status(200).send({ docs: nNews });
  } else {
    return res.status(400).send();
  }
});

router.get("/show", async (req, res) => {
  const { page = 1 } = req.query;

  const news = await News.paginate(
    {},
    {
      page,
      limit: 10,
      sort: {
        createAt: -1 //  Sort by Date Added DESC
      }
    }
  ); //  buscando todas as noticias

  const nova = await Promise.all(
    news.docs.map(async teste => {
      //    acha o autor de cada postagem e anexa ao json
      const { name } = await User.findOne(teste.userId);

      const a = JSON.stringify(teste);
      const b = JSON.parse(a);

      b.autor = name;

      return b;
    })
  );
  news.docs = nova;
  return res.status(200).json(news);
});

router.post("/remove", authMiddleware, newsAuthQuery, async (req, res) => {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  // gfs.collection('uploads')

  const newsid = req.newsid;

  await News.deleteMany({ _id: newsid });
  const mfiles = await File.find({ newsid: newsid });
  await File.deleteMany({ newsid: newsid });

  const fileid = mfiles.map(t => {
    return t.fileid;
  });

  fileid.map(async t => {
    await gfs.remove({ _id: t, root: "uploads" });
  });
  res.status(200).send();
});

module.exports = app => app.use("/news", router);
