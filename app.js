const express = require("express");
//console.log(e);
const app = express();
const port = 3000;
const web = require("./routes/web");
const connectDb = require("./db/connectDB");
const cookieParser = require('cookie-parser')

//token get
app.use(cookieParser())

//image upload
const fileUpload = require('express-fileupload')
//temptiles uploaders
app.use(fileUpload({useTempFiles:true}))

//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash')

//messages
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000},
    resave: false,
    saveUnintialized: false,
}));

//flash message
app.use(flash());

//Connectdb
connectDb();

//data get
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//ejs set html css
app.set("view engine", "ejs");

//image css link
app.use(express.static("public"));

//route load
app.use("/", web);

//server create
app.listen(port, () => {
  console.log(`server start localhost:${port}`);
});
