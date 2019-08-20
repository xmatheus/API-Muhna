const news = require("../models/news");
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  const { newsid } = req.query;
  if (!newsid) {
    res.status(400).send({ erro: "news ID required" });
  }

  if (!mongoose.Types.ObjectId.isValid(newsid)) {
    return res.status(400).send({ error: "news invalid ID" });
  }

  // const otherNews = await news.findOne(newsid)
  news.findById(newsid, function(err, data) {
    if (err) {
      return res.status(400).send({ error: "news not found" });
    } else {
      if (data === null) {
        return res.status(400).send({ error: "news not found" });
      }
      req.newsid = data._id;
      return next();
    }
  });
};
