const joi = require('@hapi/joi');
const { Segments } = require('celebrate');

exports.messagePostValidation = {
    [Segments.BODY]: {
        text: joi.string().required()
    }
}

exports.messageUpdateValidation = {
    [Segments.BODY]: {
        _id: joi.string().required(),
        text: joi.string().required()
    }
}