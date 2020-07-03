const { Router } = require('express');
const router = new Router();

const { validate } = require('../middlewares');
const { userCreateValidation } = require('./users.validations');
const { userCreate } = require('./users.controller');

router.post('/create', validate(userCreateValidation), userCreate);

module.exports = router;