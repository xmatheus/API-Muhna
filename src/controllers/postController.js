const express = require("express");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

const User = require("../models/User");
const Post = require("../models/Post/post");
const authMiddleware = require("../middleware/auth");
const postAuthQuery = require("../middleware/postAuthQuery");
const File = require("../models/Post/filePost");

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, post } = req.body;
    const nova = await Post.create({ title, post, userId: req.userId });
    return res.status(200).send(nova);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "create post failed" });
  }
});

router.get("/", async (req, res) => {
  const { postid } = req.query;

  if (postid) {
    let nPost = await Post.findById({ _id: postid });
    let userId = nPost.userId;

    // console.log(userId);
    const AlterPost = async () => {
      //    acha o autor de cada postagem e anexa ao json

      const other = await User.findOne(userId);

      const a = JSON.stringify(nPost);
      const b = JSON.parse(a);

      b.autor = other.name;
      console.log(b);
      return b;
    };

    const a = await AlterPost();

    return res.status(200).send({ docs: a });
  } else {
    return res.status(400).send({ error: "post not found" });
  }
});

router.put("/update", authMiddleware, postAuthQuery, async (req, res) => {
  try {
    const { title, post } = req.body;

    const nova = await Post.findByIdAndUpdate(req.postid, {
      title,
      post
    });

    return res.status(200).send({ ok: "updated post" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "update news failed" });
  }
});

router.get("/show", async (req, res) => {
  const { page = 1, limite = 10 } = req.query;

  const limit = parseInt(limite);

  const nPost = await Post.paginate(
    {},
    {
      page,
      limit,
      sort: {
        createAt: -1 //  Sort by Date Added DESC
      }
    }
  ); //  buscando todas as noticias

  const nova = await Promise.all(
    nPost.docs.map(async teste => {
      //    acha o autor de cada postagem e anexa ao json
      const { name } = await User.findOne(teste.userId);

      const a = JSON.stringify(teste);
      const b = JSON.parse(a);

      b.autor = name;

      return b;
    })
  );
  nPost.docs = nova;
  return res.status(200).json(nPost);
});

router.post("/remove", authMiddleware, postAuthQuery, async (req, res) => {
  //		criar a rota remove
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  // gfs.collection('uploads')

  const postid = req.postid;

  await Post.deleteMany({ _id: postid });
  const mfiles = await File.find({ postid: postid });
  await File.deleteMany({ postid: postid });

  const fileid = mfiles.map(t => {
    return t.fileid;
  });

  fileid.map(async t => {
    await gfs.remove({ _id: t, root: "uploadPost" });
  });
  res.status(200).send();
});

router.post("/search", async (req, res) => {
  const { title } = req.query;

  const docs = await Post.find({
    title: {
      $regex: new RegExp(title, "ig")
    }
  });

  if (docs) {
    const nova = await Promise.all(
      docs.map(async teste => {
        //    acha o autor de cada postagem e anexa ao json
        const { name } = await User.findOne(teste.userId);

        const a = JSON.stringify(teste);
        const b = JSON.parse(a);

        b.autor = name;

        return b;
      })
    );
    return res.status(200).send({ docs: nova });
  }

  return res.status(404).send();
});

module.exports = app => app.use("/post", router);
