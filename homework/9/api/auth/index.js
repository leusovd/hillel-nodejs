const { Router } = require('express');
const router = new Router();

const { validate } = require('../../middlewares/index.js');
const { authUserValidation } = require('./auth.validations');
const { authLogin, authLogout } = require('./auth.controller');

router.post('/login', validate(authUserValidation), authLogin);
router.post('/logout', authLogout);

module.exports = router;