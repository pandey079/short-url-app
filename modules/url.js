const { Schema, model } = require('mongoose')

const urlSchema = new Schema({
    shortId: {
        type: String,
        required: true
    },
    urlRedirect: {
        type: String,
        required: true
    },
    visitHistory: [{timestamps: {type: Number}}]
}, {timestamps: true})

const Url = model('url', urlSchema);

module.exports = Url;