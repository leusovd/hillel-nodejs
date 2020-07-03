const express = require('express');
const controller = require('../controllers/messages.controller.js');
const validator = require('../middleware/messages.validations.js');
const router = express.Router();

router.get('/messages', controller.getAll);
router.get('/messages/fields', controller.getFields);
router.get('/messages/settings', controller.getSettings);
router.get(
	'/messages/:id', 
	validator.messageIdValidation,
	validator.messageExistsValidation,
	controller.getById
);
router.post('/messages', controller.createMessage);
router.put(
	'/messages/:id',
	validator.messageIdValidation,
	validator.messageExistsValidation,
	controller.updateMessage
);
router.delete(
	'/messages/:id',
	validator.messageIdValidation,
	validator.messageExistsValidation,
	controller.deleteMessage
);

module.exports = router;