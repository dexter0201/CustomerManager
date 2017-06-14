'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CitySchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    isProvince: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Citie', CitySchema);