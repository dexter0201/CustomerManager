'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var CustomerTypeSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Type', CustomerTypeSchema);