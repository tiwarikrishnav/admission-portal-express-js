const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    comment: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
); // jab hum insert krenge to 2 field dega created data and insert data time and date
const CourseModel = mongoose.model("course", CourseSchema);
module.exports = CourseModel;
