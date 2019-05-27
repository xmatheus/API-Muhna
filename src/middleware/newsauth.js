const news = require("../models/news")
const mongoose = require('mongoose')

module.exports =  (req, res, next) => {
    const {newsid} = req.headers
    if(!newsid){
        res.send({erro:'news ID required'})
    }
    
    if(!mongoose.Types.ObjectId.isValid(newsid)){
        return res.send({error:'news invalid ID'})
    }

    // const otherNews = await news.findOne(newsid)
    news.findById(newsid,function(err,data){
        if(err){
            return res.send({error:'news not found'})
        }else{
            if(data === null){
                return res.send({error:'news not found'})
            }
            req.newsid = data._id
            return next()
        }
    });
    
}