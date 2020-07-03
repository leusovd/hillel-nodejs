const { Schema, model, Types } = require("mongoose");
const dateFormat = require('dateformat');

const messageSchema = new Schema(
    {
        text: String,
        author: {
            type: String,
            default: "Anonymous",
        },
        userId: Schema.ObjectId,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        collection: "messages"
    }
);

messageSchema.pre('save', function (next) {
    this.createdAt = dateFormat('isoUtcDateTime');
    this.updatedAt = dateFormat('isoUtcDateTime');
    next();
});

exports.MessageModel = model("MessageModel", messageSchema);

exports.getClientData = (modelObj, userId) => {
    const { _id, author, text, createdAt } = modelObj;
    const doesFiveMinutesPast = (Date.now() - new Date(createdAt)) / (1000 * 60) > 5;

    // Format date
    let date = new Date(createdAt);
    date = dateFormat(date, 'yyyy-mm-dd hh:MM');

    return {
        _id,
        author,
        text,
        createdAt: date,
        editable: modelObj.userId.equals(userId) && !doesFiveMinutesPast,
        deletable: modelObj.userId.equals(userId),
    };
};
