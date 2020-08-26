const express = require("express");
const app = express();
const path = require("path");
const nunjucks = require("nunjucks");
const mongoose = require("mongoose");
const session = require("cookie-session");
const api = require("./api/index.js");
const { getReqInfo } = require('./api/middlewares');
const { setIntervalLogging } = require('./helpers/request-logger.js');

const NODE_ENV = process.env.NODE_ENV || 'dev';

if (NODE_ENV === 'dev') {
    app.use(getReqInfo);
}

nunjucks.configure(path.join(__dirname, "templates"), {
    autoescape: true,
    express: app,
    watch: true,
});

app.use("/assets", express.static(path.join(__dirname, "assets")));

// Jquery and Bootstrap libs are including here.
// Is it a right way to handle front-end libs?
app.use(
    "/jquery",
    express.static(path.join(__dirname, "node_modules", "jquery", "dist"))
);
app.use(
    "/bootstrap",
    express.static(path.join(__dirname, "node_modules", "bootstrap", "dist"))
);

// Cookie-session
app.use(
    session({
        name: "user",
        keys: ["d41d8cd98f00b204e9800998ecf8427e"],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
);

app.get("/", (req, res) => {
    res.render("pages/home.njk", {
        title: "Messenger",
        active: "home",
        user: req.session.user,
    });
});

app.get("/login", (req, res) => {
    
    // Do not allow visit page if user is logged in
    if (req.session.user) {
        return res.redirect(302, '/');
    }

    res.render("pages/login.njk", { title: "Login Page", active: "login" });
});

app.get("/register", (req, res) => {

    // Do not allow visit page if user is logged in
    if (req.session.user) {
        return res.redirect(302, '/');
    }

    res.render("pages/register.njk", {
        title: "Registration Page",
        active: "register",
    });
});

mongoose.connect(
    "mongodb+srv://leusovd:qwerty123@mynode.ftonf.mongodb.net/hillel-node",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);

mongoose.set("debug", true);

mongoose.connection.on("error", (e) => {
    console.error("MongoDB error:", e);
    process.exit(1);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", api);

app.use((err, req, res, next) => {
    res.status(err.code || 400).send({ status: "error", message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
    
    if (NODE_ENV === 'dev') {
        setIntervalLogging();
    }
});
