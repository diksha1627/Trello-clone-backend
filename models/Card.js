const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
