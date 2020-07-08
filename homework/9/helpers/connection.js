const mongoose = require("mongoose");

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