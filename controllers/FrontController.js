const UserModel = require("../models/user");
const TeacherModel = require("../models/teacher");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const checkUseAuth = require("../middleware/auth");
const CourseModel = require("../models/course");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

cloudinary.config({
  cloud_name: "dkqv3l2kh",
  api_key: "182223573185999",
  api_secret: "lXYq1Ctc8i-xuT-JoN98pE0-Y_s",
});

class FrontController {
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("Success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static registration = async (req, res) => {
    try {
      res.render("registration", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static home = async (req, res) => {
    try {
      const { name, image, email, id, role } = req.data;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      res.render("home", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mca: mca,
        r: role,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static team = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("team", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  // insert user
  static insertuser = async (req, res) => {
    try {
      //console.log(req.files.images)
      const file = req.files.images;
      //image upload cloudinary
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(imageUpload);
      // console.log("hello gwalior");
      // console.log(req.body);
      const { n, e, p, cp } = req.body;
      const user = await UserModel.findOne({ email: e });
      if (user) {
        req.flash("error", "Email Already exists");
        res.redirect("/registration");
        //console.log(user);
      } else {
        if (n && e && p && cp) {
          if (p == cp) {
            const hashPassword = await bcrypt.hash(p, 10);
            const result = new UserModel({
              name: n,
              email: e,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });
            const userdata = await result.save();
            if (userdata) {
              const token = jwt.sign({ ID: userdata._id }, "kuchbilikhsktehai");
              //console.log(token)
              res.cookie("token", token);
              this.sendVerifymail(n, e, userdata._id);
              // To redirect to login page
              req.flash(
                "error",
                "Your Registration has been successfully.Please verify your mail. ."
              );
              res.redirect("/registration");
            } else {
              req.flash("error", "Not Register.");
              res.redirect("/registration");
            }
            req.flash("Success", "Register success! plz Login");
            res.redirect("/"); //url
          } else {
            req.flash("error", "Password not Match.");
            res.redirect("/registration");
          }
        } else {
          req.flash("error", "All fields are required.");
          res.redirect("/registration");
        }
      }
      const result = new UserModel({
        name: n,
        email: e,
        password: p,
      });
      await result.save();
      res.redirect("/"); //url
    } catch (error) {
      console.log(error);
    }
  };
  static veryLogin = async (req, res) => {
    try {
      //console.log(req.body)
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      //console.log(user);
      if (user != null) {
        const ismatch = await bcrypt.compare(password, user.password);
        //console.log(ismatch)
        if (ismatch) {
          if (user.role == "user" && user.is_verified == 1) {
            const token = jwt.sign({ ID: user._id }, "kuchbilikhsktehai");
            //console.log(token)
            res.cookie("token", token);

            res.redirect("/home");
          } else if (user.role == "admin" && user.is_verified == 1) {
            const token = jwt.sign({ ID: user._id }, "kuchbilikhsktehai");
            //console.log(token)
            res.cookie("token", token);
            res.redirect("/admin/dashboard");
          } else {
            req.flash("error", "Please verify your email address.");
            res.redirect("/");
          }
          //token
        } else {
          req.flash("error", "Email or password is not match.");
          res.redirect("/");
        }
      } else {
        req.flash("error", "You are not registered user.");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("profile", { n: name, e: email, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static changePassword = async (req, res) => {
    try {
      const { id } = req.data;
      //console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.data;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        //console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  static sendVerifymail = async (name, email, user_id) => {
    //console.log(name, email, user_id);
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
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };
  static verifymail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verified: 1,
      });
      if (updateinfo) {
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static forgotPassword = async (req, res) => {
    try {
      res.render("forgotPassword", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        console.log(randomString);
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("forgotpassword");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, token) => {
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
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };
  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = FrontController;
