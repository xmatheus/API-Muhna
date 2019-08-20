const express = require("express");
const User = require("../models/User");
const Post = require("../models/post");
const authMiddleware = require("../middleware/auth");
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
    const nPost = await Post.findById({ _id: postid });
    return res.status(200).send({ docs: nPost });
  } else {
    return res.status(400).send();
  }
});

router.get("/show", async (req, res) => {
  const { page = 1 } = req.query;

  const nPost = await Post.paginate(
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

// router.post('/remove', authMiddleware,newsAuthQuery,async (req, res)=>{  //		criar a rota remove
//     const gfs = Grid(mongoose.connection.db, mongoose.mongo)
//     // gfs.collection('uploads')

//     const newsid = req.newsid

//     await News.deleteMany({_id:newsid})
//     const mfiles = await File.find({newsid:newsid})
//     await File.deleteMany({newsid:newsid})

//     const fileid = mfiles.map((t) => {
//         return t.fileid
//     })

//     fileid.map(
//         async (t) => {
//             await gfs.remove({ _id: t, root: 'uploads' })
//         })
//     res.status(200).send()
// })

module.exports = app => app.use("/post", router);
