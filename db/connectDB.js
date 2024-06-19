const mongoose = require("mongoose");
const Local_URL = 'mongodb://localhost:27017/admissionportalComplete12'

const connectDb = ()=>{
    return mongoose.connect(Local_URL)
    .then(()=>{
        console.log("Connect Successfully")
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports = connectDb