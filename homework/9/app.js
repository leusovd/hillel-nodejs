const express = require("express");
const app = express();
const path = require("path");
const nunjucks = require("nunjucks");
const session = require("cookie-session");
const { getReqInfo } = require('./middlewares/index.js');
const { setIntervalLogging } = require('./helpers/request-logger.js');

process.env.ROOT_PATH = __dirname;
require('./helpers/constants');
require('./helpers/connection');

const NODE_ENV = process.env.NODE_ENV || 'dev';
const PORT = process.env.PORT;

nunjucks.configure(path.join(__dirname, "templates"), {
    autoescape: true,
    express: app,
    watch: true,
});

if (NODE_ENV === 'dev') {
    app.use(getReqInfo);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/assets', require('./routes/assets.js'));

// Cookie-session
app.use(
    session({
        name: "user",
        keys: ["d41d8cd98f00b204e9800998ecf8427e"],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
