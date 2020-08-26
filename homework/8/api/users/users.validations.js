const joi = require('@hapi/joi');
const { Segments } = require('celebrate');

exports.userCreateValidation = {
    [Segments.BODY]: {
        email: joi.string().email().required(),
        password: joi.string().min(6).max(100).required(),
        repeatPassword: joi.string().min(6).max(100).required(),
        role: joi.string(),
        name: joi.string()
    }
}