const { Router } = require('express');
const { authGate } = require('../middlewares/index.js');
const router = new Router();

router.use('/', require('./pages.js'));
router.use('/admin', authGate, require('./admin/index.js'));
router.use("/api", require('../api/index.js'));

module.exports = router;