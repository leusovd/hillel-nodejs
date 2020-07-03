const { MessageModel, getClientData } = require('./messages.model');
const dateFormat = require('dateformat');

exports.postMessage = async (req, res, next) => {
    try {
        const user = req.session.user;
        const { text } = req.body;

        const modelParamsObj = {
            text,
            userId: user._id
        }

        if (user.name) {
            modelParamsObj.author = user.name;
        }

        const message = new MessageModel(modelParamsObj);

        await message.save();

        res.send({ data: getClientData(message, user._id) });
    } catch (e) {
        next(e);
    }    
};

exports.getAll = async (req, res, next) => {
    const userId = req.session.user._id;
    const { sortOpts, limit, skip } = req.query;

    try {
        let messageList = await MessageModel
            .find({ userId })
            .skip(skip)
            .limit(limit)
            .sort(sortOpts)
            .lean()
            .exec();

        messageList = messageList
            .filter(message => {
                return message.deletedAt === null;
            })
            .map(message => {
                return getClientData(message, userId);
            });
    
            res.send({ data: messageList });
    } catch (e) {
        next(e);
    }
    
}

exports.updateMessage = async (req, res, next) => {
    const { _id, text } = req.body;

    try {
        const message = await MessageModel.findById(_id);

        message.text = text;
        message.updatedAt = dateFormat('isoUtcDateTime');        
        await message.save();

        res.send({ data: message });
    } catch (e) {
        next(e);
    }
}

exports.deleteMessage = async (req, res, next) => {
    const { _id } = req.body;

    try {
        const message = await MessageModel.findById(_id);

        message.deletedAt = dateFormat('isoUtcDateTime');
        await message.save();

        res.send({ message: 'Message has been successfully deleted', data: { _id } });
    } catch (e) {
        next(e);
    }
}