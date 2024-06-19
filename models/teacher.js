const mongoose = require('mongoose')

const TeacherSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    subject:{
        type:String,
        require:true
    },
    class:{
        type:String,
        require:true
    }
})
const TeacherModel = mongoose.model('teacher', TeacherSchema)

module.exports = TeacherSchema