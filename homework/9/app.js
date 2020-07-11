const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const nunjucks = require("nunjucks");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const { requestInfo } = require('./middlewares/index.js');
const { setIntervalLogging } = require('./helpers/request-logger.js');

process.env.ROOT_PATH = __dirname;
require('./helpers/constants')

const NODE_ENV = process.env.NODE_ENV || 'dev';
const PORT = process.env.PORT;

nunjucks.configure(path.join(__dirname, "templates"), {
    autoescape: true,
    express: app,
    watch: true,
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

if (NODE_ENV === 'dev') {
    app.use(requestInfo);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/assets', require('./routes/assets.js'));

// Cookie-session
app.use(
    session({
        secret: 'd41d8cd98f00b204e9800998ecf8427e',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            stringify: false
        })
    })
);

app.use('/', require('./routes/index.js'));

app.use((err, req, res, next) => {
    res.status(err.code || 400).send({ status: "error", message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
    
    if (NODE_ENV === 'dev') {
        setIntervalLogging();
    }
});
