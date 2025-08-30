const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Note', noteSchema);