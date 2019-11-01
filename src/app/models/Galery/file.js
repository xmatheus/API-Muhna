const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('../../database');

const FileSchema = new mongoose.Schema({
    originalname: {
        type: String,
        require: true,
    },
    contentType: {
        type: String,
        require: true,
    },
    fileid: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    filename: {
        type: String,
        require: true,
    },
    size: {
        type: Number,
        require: true,
    },
    uploadDate: {
        type: Date,
        require: true,
    },
});
FileSchema.plugin(mongoosePaginate);
const Galery = mongoose.model('Galery', FileSchema);

module.exports = Galery;
