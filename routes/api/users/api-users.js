const express = require('express');
const router = express.Router();
const ctrl = require('../../../controller/users');
const validate = require('./valid-users');
const guard = require('../../../helpers/guard');
const { createAccountLimiter } = require('../../../helpers/rate-limits');
const { upload } = require('../../../helpers/upload');

router.post(
  '/registrate',
  validate.createUser,
  createAccountLimiter,
  ctrl.registerUser,
);
router.post('/login', validate.loginUser, ctrl.loginUser);
router.post('/logout', guard, ctrl.logoutUser);
router.get('/current', guard, ctrl.getUser);
router.patch('/', guard, validate.updateSubscription, ctrl.updateSubscription);

router.patch(
  '/avatar',
  [guard, upload.single('avatar'), validate.updateAvatar],
  ctrl.updateAvatar,
);

module.exports = router;
