const CourseModel = require ("../models/course");
const nodemailer = require("nodemailer");
class AdminController {
  static dashboard = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("admin/dashboard", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseDisplay = async (req, res) => {
    try {
      //console.log (req.body)
      const { name, email, image } = req.data;
      const data = await CourseModel.find();
      //console.log(data);
      res.render("admin/display", {
        n: name,
        i: image,
        e: email,
        d: data,
        msg: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static courseview = async (req, res) => {
    try {
      // console.log(req.params.id)  // To get id from view button
      // console.log (req.body)
      const { name, email, image } = req.data;
      const data = await CourseModel.findById(req.params.id);
      // console.log(data);
      res.render("admin/view", { n: name, i: image, e: email, d: data });
    } catch (error) {
      console.log(error);
    }
  };
  static courseedit = async (req, res) => {
    try {
      // console.log(req.params.id)  // To get id from view button
      // console.log (req.body)
      const { name, email, image } = req.data;
      const data = await CourseModel.findById(req.params.id);
      // console.log(data);
      res.render("admin/edit", { n: name, i: image, e: email, d: data });
    } catch (error) {
      console.log(error);
    }
  };
  static coursedelete = async (req, res) => {
    try {
      await CourseModel.findByIdAndDelete(req.params.id);
      req.flash("Success", "Course Delete Successfully");
      res.redirect("/admin/display");
    } catch (error) {
      console.log(error);
    }
  };
  static updatestatus = async (req, res) => {
    try {
      //console.log(req.body);
      const { comment, name, email, status } = req.body;
      await CourseModel.findByIdAndUpdate(req.params.id, {
        comment: comment,
        status: status,
      });
      this.sendEmail(name, email, status, comment);
      res.redirect("/admin/dashboard");
    } catch {
      console.log(error);
    }
  };
  static updateprofile = async (req, res) => {
    try {
      const { id } = req.data;
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      const update = await CourseModel.findByIdAndUpdate(req.params.id, {
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        address: address,
        education: education,
        course: course,
        user_id: id,
      });
      req.flash("success", "Course Update Successfully.");
      res.redirect("admin/updateprofile");
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, status, comment) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "amannarwariya216@gmail.com",
        pass: "kmclbmxfxzhfoakj",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: ` Course ${status}`, // Subject line
      text: "heelo", // plain text body
      html: `<b>${name}</b> Course  <b>${status}</b> successful! <br>
             <b>Comment from Admin</b> ${comment} `, // html body
    });
  };
  //   static courseview = async (req, res) => {
  //     try {
  //       // console.log(req.params.id)  // To get id from view button
  //       // console.log (req.body)
  //       const {name, email, image} = req.data;
  //       const data = await CourseModel.findById(req.params.id);
  //       // console.log(data);
  //       res.render("course/view", {n: name, i: image, e: email, d: data});
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   static coursedelete = async (req, res) => {
  //     try {
  //       await CourseModel.findByIdAndDelete(req.params.id);
  //       req.flash("Success", "Course Delete Successfully");
  //       res.redirect("/CourseDisplay");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   static courseedit = async (req, res) => {
  //     try {
  //       // console.log(req.params.id)  // To get id from view button
  //       // console.log (req.body)
  //       const {name, email, image} = req.data;
  //       const data = await CourseModel.findById(req.params.id);
  //       // console.log(data);
  //       res.render("course/edit", {n: name, i: image, e: email, d: data});
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
}

module.exports = AdminController;
