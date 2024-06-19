const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();
const checkUseAuth = require("../middleware/auth");
const CourseController = require("../controllers/CourseController");
const authRoles = require("../middleware/adminrole");
const isLogin = require("../middleware/islogin")
const AdminController = require("../controllers/AdminController");

//route localhost:3000('/')
route.get("/",isLogin, FrontController.login);
route.get("/registration", FrontController.registration);
route.get("/home", checkUseAuth, FrontController.home);
route.get("/about", checkUseAuth, FrontController.about);
route.get("/contact", checkUseAuth, FrontController.contact);
route.get("/team", checkUseAuth, FrontController.team);

//insert user
route.post("/insertuser", FrontController.insertuser);
route.post("/verifyLogin", FrontController.veryLogin);
route.get("/logout", FrontController.logout);
route.get("/profile",checkUseAuth,FrontController.profile);
route.post("/updateProfile", checkUseAuth, FrontController.updateProfile);
route.post("/changePassword", checkUseAuth, FrontController.changePassword);
route.get("/forgotPassword", FrontController.forgotPassword);
route.post("/forgot_Password", FrontController.forgetPasswordVerify);
route.get("/reset-password", FrontController.reset_Password);
route.post("/reset_Password1", FrontController.reset_Password1);

//courseController
route.post("/course_insert", checkUseAuth, CourseController.courseInsert);
route.get("/courseDisplay", checkUseAuth, CourseController.courseDisplay);
route.get("/courseView/:id",checkUseAuth,CourseController.courseView);
route.get("/courseDelete/:id", checkUseAuth, CourseController.courseDelete);
route.get("/courseEdit/:id", checkUseAuth, CourseController.courseEdit);
route.post("/courseUpdate/:id", checkUseAuth, CourseController.courseUpdate); 

// admin part
route.get("/admin/dashboard", checkUseAuth,authRoles('admin'), AdminController.dashboard)
route.get("/admin/CourseDisplay", checkUseAuth,authRoles('admin'),AdminController.courseDisplay);
route.post("/update_status/:id", checkUseAuth,authRoles('admin'),AdminController.updatestatus);
route.get("/admin/view/:id", checkUseAuth,authRoles('admin'), AdminController.courseview);
route.get("/admin/edit/:id", checkUseAuth, authRoles('admin'),AdminController.courseedit)
route.get("/admin/updateprofile",checkUseAuth, authRoles('admin'),AdminController.updateprofile);
route.get("/verify", FrontController.verifymail)

module.exports = route;
