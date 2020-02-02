//import mongoose
const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema ({
    name: {
    type: String,
    required: true
    },

    place: {
    type:String,
    required: true
    },
    link:{
        type:String,
        required: true
    },
    img:{
        type:String,
        required:true
    },
    date: {
    type: Date,
    required: true
    },

    registers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    }, {
      timestamps: true
})

module.exports = mongoose.model('Event', eventSchema) 