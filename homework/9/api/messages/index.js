const { Router } = require('express');
const router = new Router();

const { validate, handleMessagesQueryParams } = require('../middlewares');
const { messagePostValidation, messageUpdateValidation } = require('./messages.validations');
const { getAll, postMessage, updateMessage, deleteMessage } = require('./messages.controller');

router.get('/', handleMessagesQueryParams, getAll);
router.post('/post', validate(messagePostValidation), postMessage);
router.patch('/update', validate(messageUpdateValidation), updateMessage);
router.delete('/delete', deleteMessage);

module.exports = router;