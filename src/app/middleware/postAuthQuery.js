const mongoose = require('mongoose');
const post = require('../models/Post/post');

// verifica se existe algum post com esse id

module.exports = (req, res, next) => {
    const { postid } = req.query;
    if (!postid) {
        res.status(400).send({ erro: 'post ID required' });
    }

    if (!mongoose.Types.ObjectId.isValid(postid)) {
        return res.status(400).send({ error: 'post invalid ID' });
    }

    // const otherNews = await post.findOne(postid)
    post.findById(postid, (err, data) => {
        if (err) {
            return res.status(400).send({ error: 'post not found' });
        }
        if (data === null) {
            return res.status(400).send({ error: 'post not found' });
        }
        req.postid = data._id;
        return next();
    });
};
