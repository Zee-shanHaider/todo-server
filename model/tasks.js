const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')

const taskSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    todoDate:{
        type: Date,
        required: true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Task', taskSchema)