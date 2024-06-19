const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        default: 'user'
    },
    image: {
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    token: {
        type:String
    },
    is_verified:{
        type:Number,
        default:0
    }
},{ timestamps: true}) // jab hum insert krenge to 2 field dega created data and insert data time and date
const UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel