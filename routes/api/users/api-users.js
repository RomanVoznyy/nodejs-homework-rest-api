const express = require('express');
const router = express.Router();
const ctrl = require('../../../controller/users');
const validate = require('./valid-users');
const guard = require('../../../helpers/guard');

router.post('/registrate', validate.createUser, ctrl.registerUser);
router.post('/login', validate.loginUser, ctrl.loginUser);
router.post('/logout', guard, ctrl.logoutUser);
router.get('/current', guard, ctrl.getUser);
router.patch('/', guard, validate.updateSubscription, ctrl.updateSubscription);

module.exports = router;
